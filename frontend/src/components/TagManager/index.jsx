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
    } catch (err) { alert(err.message); }
  };

  const handleRemove = async (tagName) => {
    try {
      await apiService.removeTag(jobId, tagName);
      const updatedTags = tags.filter(t => t !== tagName);
      setTags(updatedTags);
      onUpdate(updatedTags);
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h4>Tags</h4>
      {tags.map(tag => (
        <span key={tag}>
          {tag} <button onClick={() => handleRemove(tag)}>x</button>
        </span>
      ))}
      <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Nouveau tag" />
      <button onClick={handleAdd}>Ajouter</button>
    </div>
  );
};

export default TagManager;