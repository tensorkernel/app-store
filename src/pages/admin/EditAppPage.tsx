import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Database } from '../../types/supabase';

type App = Database['public']['Tables']['apps']['Row'];

const EditAppPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    screenshots: [''],
    downloadUrl: '',
    category: '',
    tags: [''],
    seoKeywords: '',
    seoDescription: '',
    version: '',
    publisher: '',
  });

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('apps')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title,
            description: data.description,
            thumbnailUrl: data.thumbnail_url,
            screenshots: data.screenshots as string[] || [''],
            downloadUrl: data.download_url,
            category: data.category,
            tags: data.tags || [''],
            seoKeywords: data.seo_keywords,
            seoDescription: data.seo_description,
            version: data.version,
            publisher: data.publisher,
          });
        }
        
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('apps')
          .select('category')
          .order('category');
        
        // Extract unique categories
        const uniqueCategories = [...new Set((categoriesData || []).map(app => app.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching app:', error);
        toast.error('Failed to load app data');
        navigate('/admin/apps');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApp();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Validate form
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.thumbnailUrl.trim()) {
      toast.error('Thumbnail URL is required');
      return;
    }
    
    if (!formData.downloadUrl.trim()) {
      toast.error('Download URL is required');
      return;
    }
    
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }
    
    if (!formData.version.trim()) {
      toast.error('Version is required');
      return;
    }
    
    if (!formData.publisher.trim()) {
      toast.error('Publisher is required');
      return;
    }
    
    // Filter out empty tags and screenshots
    const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
    const filteredScreenshots = formData.screenshots.filter(url => url.trim() !== '');
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('apps')
        .update({
          title: formData.title,
          description: formData.description,
          thumbnail_url: formData.thumbnailUrl,
          screenshots: filteredScreenshots,
          download_url: formData.downloadUrl,
          category: formData.category,
          tags: filteredTags,
          seo_keywords: formData.seoKeywords,
          seo_description: formData.seoDescription,
          version: formData.version,
          publisher: formData.publisher,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('App updated successfully!');
      navigate('/admin/apps');
    } catch (error) {
      console.error('Error updating app:', error);
      toast.error('Failed to update app. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/apps')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit App</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  App Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher *
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="flex">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                </div>
              </div>
              
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL *
                </label>
                <input
                  type="url"
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Download URL *
                </label>
                <input
                  type="url"
                  id="downloadUrl"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="space-y-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Screenshots
                </label>
                <div className="space-y-2">
                  {formData.screenshots.map((url, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleScreenshotChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <button
                    type="button"
                    onClick={addScreenshot}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Screenshot
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  id="seoKeywords"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., game, puzzle, adventure"
                />
              </div>
              
              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description for search engines"
                ></textarea>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppPage;
