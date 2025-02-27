import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, Image, Link as LinkIcon, Tag, Info, FileText, User, Grid, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface FormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  screenshots: string[];
  downloadUrl: string;
  category: string;
  tags: string[];
  seoKeywords: string;
  seoDescription: string;
  version: string;
  publisher: string;
  customCategory: string;
}

const AddAppPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewScreenshots, setPreviewScreenshots] = useState<string[]>([]);
  const [formProgress, setFormProgress] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    screenshots: [''],
    downloadUrl: '',
    category: '',
    customCategory: '',
    tags: [''],
    seoKeywords: '',
    seoDescription: '',
    version: '',
    publisher: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('category')
          .order('category');
        
        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = [...new Set((data || []).map(app => app.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['title', 'description', 'thumbnailUrl', 'downloadUrl', 'version', 'publisher'];
    const categoryField = useCustomCategory ? 'customCategory' : 'category';
    
    const filledRequiredFields = requiredFields.filter(field => 
      formData[field as keyof FormData] && (formData[field as keyof FormData] as string).trim() !== ''
    ).length;
    
    const categoryFilled = formData[categoryField as keyof FormData] && 
      (formData[categoryField as keyof FormData] as string).trim() !== '';
    
    const totalRequiredFields = requiredFields.length + 1; // +1 for category
    const progress = ((filledRequiredFields + (categoryFilled ? 1 : 0)) / totalRequiredFields) * 100;
    
    setFormProgress(progress);
  }, [formData, useCustomCategory]);

  // Preview thumbnail when URL changes
  useEffect(() => {
    if (formData.thumbnailUrl.trim()) {
      setPreviewThumbnail(formData.thumbnailUrl);
    } else {
      setPreviewThumbnail(null);
    }
  }, [formData.thumbnailUrl]);

  // Preview screenshots when URLs change
  useEffect(() => {
    const validScreenshots = formData.screenshots.filter(url => url.trim() !== '');
    setPreviewScreenshots(validScreenshots);
  }, [formData.screenshots]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleScreenshotChange = (index: number, value: string) => {
    const newScreenshots = [...formData.screenshots];
    newScreenshots[index] = value;
    setFormData(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const addScreenshot = () => {
    setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, ''] }));
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = [...formData.screenshots].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.thumbnailUrl.trim()) {
      errors.thumbnailUrl = 'Thumbnail URL is required';
    } else if (!isValidUrl(formData.thumbnailUrl)) {
      errors.thumbnailUrl = 'Please enter a valid URL';
    }
    
    if (!formData.downloadUrl.trim()) {
      errors.downloadUrl = 'Download URL is required';
    } else if (!isValidUrl(formData.downloadUrl)) {
      errors.downloadUrl = 'Please enter a valid URL';
    }
    
    if (useCustomCategory) {
      if (!formData.customCategory.trim()) {
        errors.customCategory = 'Custom category is required';
      }
    } else {
      if (!formData.category) {
        errors.category = 'Category is required';
      }
    }
    
    if (!formData.version.trim()) {
      errors.version = 'Version is required';
    }
    
    if (!formData.publisher.trim()) {
      errors.publisher = 'Publisher is required';
    }
    
    // Validate screenshot URLs
    const validScreenshots = formData.screenshots.filter(url => url.trim() !== '');
    for (let i = 0; i < validScreenshots.length; i++) {
      if (!isValidUrl(validScreenshots[i])) {
        errors[`screenshot_${i}`] = 'Please enter a valid URL';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // Filter out empty tags and screenshots
    const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
    const filteredScreenshots = formData.screenshots.filter(url => url.trim() !== '');
    
    setIsSubmitting(true);
    
    try {
      const finalCategory = useCustomCategory ? formData.customCategory : formData.category;
      
      const { error } = await supabase.from('apps').insert({
        title: formData.title,
        description: formData.description,
        thumbnail_url: formData.thumbnailUrl,
        screenshots: filteredScreenshots,
        download_url: formData.downloadUrl,
        category: finalCategory,
        tags: filteredTags,
        seo_keywords: formData.seoKeywords,
        seo_description: formData.seoDescription,
        version: formData.version,
        publisher: formData.publisher,
      });
      
      if (error) throw error;
      
      toast.success('App added successfully!');
      navigate('/admin/apps');
    } catch (error) {
      console.error('Error adding app:', error);
      toast.error('Failed to add app. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/apps')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Add New App</h1>
      </div>
      
      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Form completion</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(formProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FileText size={16} className="mr-2 text-blue-500" />
                  App Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="publisher" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="mr-2 text-blue-500" />
                  Publisher *
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.publisher ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.publisher && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.publisher}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Grid size={16} className="mr-2 text-blue-500" />
                  Category *
                </label>
                {!useCustomCategory ? (
                  <div className="flex flex-col space-y-2">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="games">Games</option>
                      <option value="social">Social</option>
                      <option value="productivity">Productivity</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="tools">Tools</option>
                      <option value="education">Education</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="health">Health & Fitness</option>
                    </select>
                    {validationErrors.category && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setUseCustomCategory(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 self-start"
                    >
                      + Add custom category
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      id="customCategory"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      placeholder="Enter custom category"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.customCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.customCategory && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.customCategory}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setUseCustomCategory(false)}
                      className="text-sm text-blue-600 hover:text-blue-800 self-start"
                    >
                      Use existing category
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="version" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Info size={16} className="mr-2 text-blue-500" />
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="e.g., 1.0.0"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.version ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.version && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.version}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="thumbnailUrl" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Image size={16} className="mr-2 text-blue-500" />
                  Thumbnail URL *
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.thumbnailUrl && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.thumbnailUrl}</p>
                  )}
                  
                  {previewThumbnail && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                        <img 
                          src={previewThumbnail} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="downloadUrl" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <LinkIcon size={16} className="mr-2 text-blue-500" />
                  Download URL *
                </label>
                <input
                  type="url"
                  id="downloadUrl"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/app.apk"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.downloadUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.downloadUrl && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.downloadUrl}</p>
                )}
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Tag size={16} className="mr-2 text-blue-500" />
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter tag"
                      />
                      {formData.tags.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FileText size={16} className="mr-2 text-blue-500" />
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                ></textarea>
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Tip: Use line breaks to format your description. Describe features, requirements, and other important details.
                </p>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Image size={16} className="mr-2 text-blue-500" />
                  Screenshots
                </label>
                <div className="space-y-2">
                  {formData.screenshots.map((url, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleScreenshotChange(index, e.target.value)}
                        className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          validationErrors[`screenshot_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter screenshot URL"
                      />
                      {formData.screenshots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  {validationErrors[`screenshot_${formData.screenshots.length - 1}`] && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors[`screenshot_${formData.screenshots.length - 1}`]}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={addScreenshot}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Screenshot
                  </button>
                </div>
                
                {previewScreenshots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Screenshot Previews:</p>
                    <div className="flex flex-wrap gap-2">
                      {previewScreenshots.map((url, index) => (
                        <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Screenshot ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="seoKeywords" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Tag size={16} className="mr-2 text-blue-500" />
                  SEO Keywords
                </label>
                <input
                  type="text"
                  id="seoKeywords"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., game, puzzle, adventure"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Comma-separated keywords to help users find your app in search results.
                </p>
              </div>
              
              <div>
                <label htmlFor="seoDescription" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FileText size={16} className="mr-2 text-blue-500" />
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description for search engines"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  A concise description (150-160 characters) that will appear in search engine results.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/apps')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Add App
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppPage;
