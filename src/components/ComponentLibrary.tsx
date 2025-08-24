import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ComponentType } from '../types/circuit';
import { componentLibrary, getCategories } from '../data/componentLibrary';

interface ComponentLibraryProps {
  onComponentSelect: (type: ComponentType, position: { x: number; y: number }) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onComponentSelect }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(getCategories()));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleComponentClick = (type: ComponentType) => {
    // When a component is clicked, it will be added to the canvas at a default position
    // The actual positioning will be handled by the canvas drag-and-drop
    onComponentSelect(type, { x: 100, y: 100 });
  };

  const categories = getCategories();

  return (
    <div className="component-library">
      <div className="component-library-header">
        Component Library
      </div>
      
      <div className="component-categories">
        {categories.map(category => {
          const components = componentLibrary.filter(comp => comp.category === category);
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category} className="component-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {category}
              </div>
              
              {isExpanded && (
                <div className="category-content">
                  {components.map(component => (
                    <div
                      key={component.type}
                      className="component-item"
                      onClick={() => handleComponentClick(component.type)}
                      title={component.name}
                    >
                      <div className="component-icon">
                        {component.icon}
                      </div>
                      <div className="component-name">
                        {component.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};