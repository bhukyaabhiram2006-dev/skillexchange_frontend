import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useExchanges } from '../../context/ExchangeContext';
import { CATEGORIES } from '../../data/mockData';
import { Plus, Tag } from 'lucide-react';

export default function PostSkillModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { postNewSkill } = useExchanges();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('programming');
  const [level, setLevel] = useState('Intermediate');
  const [format, setFormat] = useState('1-on-1 Mentoring');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const categoryObj = CATEGORIES.find((c) => c.id === category);

    postNewSkill(
      {
        title,
        category,
        categoryName: categoryObj ? categoryObj.name : 'General',
        level,
        format,
        description,
        tags: tags.length ? tags : ['Skill', 'Mentoring'],
        lookingFor: lookingFor || 'Open to learn any skill',
      },
      currentUser
    );

    // Reset and close
    setTitle('');
    setDescription('');
    setTagsInput('');
    setLookingFor('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Offer a Skill to the Community"
      subtitle="Share your knowledge and connect with peers wanting to learn from you."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Skill Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Python Data Visualization with Matplotlib"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Proficiency Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Preferred Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="1-on-1 Mentoring">1-on-1 Mentoring</option>
            <option value="Project Collab">Project Collab</option>
            <option value="Study Group">Study Group</option>
            <option value="Async Review">Async Review</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Skill Description & What You'll Cover
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you will teach, prerequisites, and what hands-on exercises you can do together..."
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. Python, Matplotlib, Charts, Statistics"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            What skill(s) do you want to learn in exchange?
          </label>
          <input
            type="text"
            required
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder="e.g., UI/UX Design, Figma, or Spanish"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Skill</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
