import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, User, FileText, Tag } from 'lucide-react';
import { ActivityFormData, ActivityCategory, ActivityType } from '../types';

interface AddActivityFormProps {
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => Promise<void>;
}

const categories: { value: ActivityCategory; label: string }[] = [
  { value: 'academic', label: 'Academic' },
  { value: 'extracurricular', label: 'Extracurricular' },
  { value: 'research', label: 'Research' },
  { value: 'community-service', label: 'Community Service' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'internship', label: 'Internship' },
  { value: 'competition', label: 'Competition' },
  { value: 'certification', label: 'Certification' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
];

const types: { value: ActivityType; label: string }[] = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'certification', label: 'Certification' },
  { value: 'competition', label: 'Competition' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer Work' },
  { value: 'leadership', label: 'Leadership Role' },
  { value: 'research', label: 'Research Project' },
  { value: 'publication', label: 'Publication' },
  { value: 'project', label: 'Project' },
  { value: 'course', label: 'Online Course' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'sports', label: 'Sports Event' },
  { value: 'cultural', label: 'Cultural Event' },
  { value: 'technical', label: 'Technical Event' },
];

export const AddActivityForm: React.FC<AddActivityFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    description: '',
    category: 'academic',
    type: 'workshop',
    date: '',
    duration: 0,
    location: '',
    organizer: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'certificates' | 'images') => {
    const files = e.target.files;
    if (files) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: files,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.organizer?.trim()) {
      newErrors.organizer = 'Organizer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add New Activity</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Activity Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input w-full ${errors.title ? 'border-red-300' : ''}`}
              placeholder="e.g., React.js Advanced Workshop"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`input w-full resize-none ${errors.description ? 'border-red-300' : ''}`}
              placeholder="Provide a detailed description of the activity..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input w-full"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input w-full ${errors.date ? 'border-red-300' : ''}`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="input w-full"
                placeholder="e.g., 8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Tech Center, Room 201"
              />
            </div>

            {/* Organizer */}
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Organizer *
              </label>
              <input
                type="text"
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className={`input w-full ${errors.organizer ? 'border-red-300' : ''}`}
                placeholder="e.g., Google Developer Groups"
              />
              {errors.organizer && <p className="mt-1 text-sm text-red-600">{errors.organizer}</p>}
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certificates */}
            <div>
              <label htmlFor="certificates" className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Certificates
              </label>
              <input
                type="file"
                id="certificates"
                name="certificates"
                onChange={(e) => handleFileChange(e, 'certificates')}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="input w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG files accepted</p>
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={(e) => handleFileChange(e, 'images')}
                multiple
                accept=".jpg,.jpeg,.png"
                className="input w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG files accepted</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};