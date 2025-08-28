import type { Task } from '../types';

export const validators = {
  isValidTaskTitle: (title: string): boolean => {
    return title.trim().length > 0 && title.trim().length <= 200;
  },

  isValidTaskDescription: (description?: string): boolean => {
    if (!description) return true;
    return description.trim().length <= 1000;
  },

  isValidEstimatedTime: (time?: number): boolean => {
    if (!time) return true;
    return time > 0 && time <= 480; // Max 8 hours
  },

  isValidTag: (tag: string): boolean => {
    return tag.trim().length > 0 && tag.trim().length <= 20 && !tag.includes(' ');
  },

  sanitizeTitle: (title: string): string => {
    return title.trim().slice(0, 200);
  },

  sanitizeDescription: (description: string): string => {
    return description.trim().slice(0, 1000);
  },

  sanitizeTag: (tag: string): string => {
    return tag.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 20);
  },

  validateTask: (task: Partial<Task>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!task.title || !validators.isValidTaskTitle(task.title)) {
      errors.push('제목은 1-200자 사이여야 합니다.');
    }

    if (task.description && !validators.isValidTaskDescription(task.description)) {
      errors.push('설명은 1000자를 초과할 수 없습니다.');
    }

    if (task.estimatedTime && !validators.isValidEstimatedTime(task.estimatedTime)) {
      errors.push('예상 소요 시간은 1-480분 사이여야 합니다.');
    }

    if (task.tags) {
      const invalidTags = task.tags.filter(tag => !validators.isValidTag(tag));
      if (invalidTags.length > 0) {
        errors.push('태그는 공백 없이 1-20자 사이여야 합니다.');
      }
    }

    if (task.dueDate && task.dueDate < new Date()) {
      errors.push('마감일은 현재 시간보다 미래여야 합니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};