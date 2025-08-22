import type { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const createSampleTasks = (): Task[] => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return [
    {
      id: uuidv4(),
      title: '프로덕션 핫픽스 배포',
      description: '긴급한 버그 수정을 위한 핫픽스 배포 작업',
      status: 'today',
      priority: 'urgent',
      tags: ['backend', 'urgent'],
      createdAt: yesterday,
      updatedAt: now,
      estimatedTime: 60,
      dueDate: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2시간 후
    },
    {
      id: uuidv4(),
      title: 'PR #245 리뷰',
      description: '데이빗이 작성한 인증 모듈 리팩토링 PR을 검토해야 합니다.',
      status: 'today',
      priority: 'high',
      tags: ['review', 'frontend'],
      createdAt: yesterday,
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000), // 30분 전
      estimatedTime: 45,
    },
    {
      id: uuidv4(),
      title: '문서 업데이트',
      description: 'API 문서를 최신 변경사항에 맞춰 업데이트',
      status: 'completed',
      priority: 'medium',
      tags: ['docs'],
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3시간 전
      updatedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1시간 전
      completedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1시간 전
      estimatedTime: 30,
      actualTime: 25,
    },
    {
      id: uuidv4(),
      title: '인증 모듈 리팩토링',
      description: '기존 인증 시스템을 보다 안전하고 확장 가능한 구조로 개선',
      status: 'backlog',
      priority: 'high',
      tags: ['backend', 'security'],
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      estimatedTime: 180,
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1주일 후
    },
    {
      id: uuidv4(),
      title: 'API 테스트 케이스 작성',
      description: '새로운 API 엔드포인트들에 대한 단위 테스트와 통합 테스트 작성',
      status: 'backlog',
      priority: 'medium',
      tags: ['testing', 'backend'],
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1일 전
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      estimatedTime: 120,
    },
    {
      id: uuidv4(),
      title: '새로운 프레임워크 리서치',
      description: 'Next.js 15 버전의 새로운 기능들과 마이그레이션 방법 조사',
      status: 'backlog',
      priority: 'low',
      tags: ['research', 'frontend'],
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3일 전
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      estimatedTime: 240,
    },
    {
      id: uuidv4(),
      title: '데이터베이스 최적화',
      description: '쿼리 성능 개선 및 인덱스 최적화 작업',
      status: 'completed',
      priority: 'high',
      tags: ['database', 'performance'],
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4일 전
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
      completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
      estimatedTime: 150,
      actualTime: 200,
    },
  ];
};

// 개발 모드에서만 샘플 데이터 로드
export const loadSampleData = () => {
  if (import.meta.env.DEV) {
    const existingTasks = localStorage.getItem('todays-backlog-tasks');
    if (!existingTasks || JSON.parse(existingTasks).length === 0) {
      const sampleTasks = createSampleTasks();
      localStorage.setItem('todays-backlog-tasks', JSON.stringify(sampleTasks));
      console.log('샘플 데이터가 로드되었습니다.', sampleTasks);
    }
  }
};