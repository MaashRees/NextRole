import React, { useState } from 'react';
import apiService from '../../services/ApiService';

const TagManager = ({ jobId, initialTags, onUpdate }) => {
  const [tags, setTags] = useState(initialTags || []);
  const [newTag, setNewTag] = useState('');

  const handleAdd = async () => {
    if (!newTag) return;
    try {
      await apiService.addTag(jobId, newTag);
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setNewTag('');
      onUpdate(updatedTags);
    } catch (err) { console.error(err.message); }
  };

  const handleRemove = async (tagName) => {
    try {
      await apiService.removeTag(jobId, tagName);
      const updatedTags = tags.filter(t => t !== tagName);
      setTags(updatedTags);
      onUpdate(updatedTags);
    } catch (err) { console.error(err.message); }
  };

  return (
    <div className="tag-manager">
      <h4>Tags</h4>
      <div className="tag-list">
        {tags.map(tag => (
          <span key={tag} className="tag-item">
            {tag} <button onClick={() => handleRemove(tag)}>×</button>
          </span>
        ))}
      </div>
      <div className="tag-input">
        <input 
          value={newTag} 
          onChange={(e) => setNewTag(e.target.value)} 
          placeholder="Nouveau tag" 
        />
        <button className="btn btn-primary" onClick={handleAdd}>Ajouter</button>
      </div>
    </div>
  );
};

export default TagManager;