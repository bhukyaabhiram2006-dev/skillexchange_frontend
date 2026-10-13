import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../common/ProfileAvatar';
import Badge from '../common/Badge';
import RatingStars from '../common/RatingStars';
import ScheduleSessionModal from './ScheduleSessionModal';
import { useExchanges } from '../../context/ExchangeContext';
import { useMessages } from '../../context/MessageContext';
import {
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
  MoreVertical,
  Check,
  X,
} from 'lucide-react';

export default function ExchangeCard({ exchange }) {
  const { acceptExchange, rejectExchange, completeExchange, cancelExchange } = useExchanges();
  const { startConversationWithStudent } = useMessages();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const statusBadgeMap = {
    pending: { variant: 'amber', label: 'Pending Proposal' },
    active: { variant: 'emerald', label: 'Active Exchange' },
    completed: { variant: 'indigo', label: 'Completed' },
    cancelled: { variant: 'rose', label: 'Cancelled' },
  };

  const currentStatus = statusBadgeMap[exchange.status] || {
    variant: 'slate',
    label: exchange.status,
  };

  const handleOpenChat = () => {
    startConversationWithStudent(
      {
        id: exchange.partnerId,
        name: exchange.partnerName,
        avatar: exchange.partnerAvatar,
        college: exchange.partnerCollege,
      },
      `${exchange.skillLearning} ⇄ ${exchange.skillTeaching}`
    );
  };

  const handleConfirmComplete = () => {
    completeExchange(exchange.id, reviewRating, reviewComment);
    setIsCompleting(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={exchange.partnerAvatar}
                name={exchange.partnerName}
                size="lg"
              />
              <div>
                <Link
                  to={`/students/${exchange.partnerId}`}
                  className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
                >
                  {exchange.partnerName}
                </Link>
                <p className="text-xs text-slate-400">{exchange.partnerCollege}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Initiated: {exchange.dateInitiated}
                </p>
              </div>
            </div>

            <Badge variant={currentStatus.variant} size="sm">
              {currentStatus.label}
            </Badge>
          </div>

          {/* Skill exchange mapping */}
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-100 mb-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase flex-shrink-0">
                You Teach
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {exchange.skillTeaching}
              </span>
            </div>

            <div className="flex items-center justify-center my-0.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-start gap-2">
              <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded uppercase flex-shrink-0">
                You Learn
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {exchange.skillLearning}
              </span>
            </div>
          </div>

          {/* Proposal note if pending */}
          {exchange.proposalMessage && exchange.status === 'pending' && (
            <div className="mb-4 p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed italic">
              "{exchange.proposalMessage}"
            </div>
          )}

          {/* Completed review if completed */}
          {exchange.review && exchange.status === 'completed' && (
            <div className="mb-4 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs text-indigo-900">
              <div className="flex items-center gap-1.5 mb-1">
                <RatingStars rating={exchange.review.rating} />
                <span className="font-semibold text-xs">Partner Review</span>
              </div>
              <p className="text-slate-600 italic">"{exchange.review.comment}"</p>
            </div>
          )}

          {/* Meta details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4">
            <div>
              <span className="text-slate-400 block">Next Session:</span>
              <span className="font-medium text-slate-700">{exchange.nextSessionDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Format:</span>
              <span className="font-medium text-slate-700">{exchange.exchangeMode}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons depending on Status */}
        <div className="pt-4 border-t border-slate-100">
          {exchange.status === 'pending' && (
            exchange.requestType === 'incoming' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => acceptExchange(exchange.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Exchange</span>
                </button>
                <button
                  onClick={() => rejectExchange(exchange.id)}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                >
                  Decline
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">
                  Awaiting {exchange.partnerName.split(' ')[0]}'s response
                </span>
                <button
                  onClick={() => rejectExchange(exchange.id)}
                  className="text-xs font-medium text-rose-600 hover:underline"
                >
                  Withdraw Request
                </button>
              </div>
            )
          )}

          {exchange.status === 'active' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsScheduleOpen(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule</span>
                </button>
                <Link
                  to="/messages"
                  onClick={handleOpenChat}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </Link>
              </div>

              {!isCompleting ? (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => setIsCompleting(true)}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Complete</span>
                  </button>
                  <button
                    onClick={() => cancelExchange(exchange.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Cancel Exchange
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-2">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Rate exchange with {exchange.partnerName}:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-lg ${star <= reviewRating ? 'text-amber-400' : 'text-slate-200'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Short feedback (optional)..."
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setIsCompleting(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmComplete}
                      className="px-3 py-1 text-xs bg-emerald-600 text-white rounded font-medium"
                    >
                      Save & Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {exchange.status === 'completed' && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exchange Completed</span>
              </span>
              <Link
                to="/messages"
                onClick={handleOpenChat}
                className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Keep in touch</span>
              </Link>
            </div>
          )}

          {exchange.status === 'cancelled' && (
            <div className="text-xs text-rose-500 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Exchange cancelled</span>
            </div>
          )}
        </div>
      </div>

      <ScheduleSessionModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultExchangeId={exchange.id}
      />
    </>
  );
}
