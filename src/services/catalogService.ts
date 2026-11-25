import {
  MOCK_CATEGORIES,
  MOCK_COURSES,
  MOCK_INSTRUCTORS,
  MOCK_VIDEOS,
} from '@/data/mockCatalog';
import {
  MOCK_ASSESSMENTS,
  MOCK_LEARNING_PATHS,
} from '@/data/mockAcademy';
import { MOCK_SUBSCRIPTION_PLANS } from '@/data/mockPricing';
import type {
  Assessment,
  Category,
  Course,
  CourseLesson,
  Instructor,
  LearningPath,
  SubscriptionPlan,
  VideoItem,
} from '@/types';

export const catalogService = {
  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  },

  getCategoryBySlug(slug: string): Category | undefined {
    return MOCK_CATEGORIES.find((c) => c.slug === slug);
  },

  getInstructors(): Instructor[] {
    return MOCK_INSTRUCTORS;
  },

  getInstructorById(id: string): Instructor | undefined {
    return MOCK_INSTRUCTORS.find((i) => i.id === id);
  },

  getAllCourses(): Course[] {
    return MOCK_COURSES;
  },

  getCourseById(id: string): Course | undefined {
    return MOCK_COURSES.find((c) => c.id === id);
  },

  getCourseBySlug(slug: string): Course | undefined {
    return MOCK_COURSES.find((c) => c.slug === slug);
  },

  getAllLessons(course: Course): CourseLesson[] {
    return course.curriculum.flatMap((sec) => sec.lessons);
  },

  getRelatedCourses(course: Course, limit = 3): Course[] {
    return MOCK_COURSES.filter(
      (c) => c.id !== course.id && (c.categorySlug === course.categorySlug || c.featured),
    ).slice(0, limit);
  },

  getAllVideos(): VideoItem[] {
    return MOCK_VIDEOS;
  },

  getVideoBySlug(slug: string): VideoItem | undefined {
    return MOCK_VIDEOS.find((v) => v.slug === slug);
  },

  getRelatedVideos(video: VideoItem, limit = 4): VideoItem[] {
    return MOCK_VIDEOS.filter(
      (v) => v.id !== video.id && (v.categorySlug === video.categorySlug || v.trending),
    ).slice(0, limit);
  },

  getLearningPaths(): LearningPath[] {
    return MOCK_LEARNING_PATHS;
  },

  getLearningPathBySlug(slug: string): LearningPath | undefined {
    return MOCK_LEARNING_PATHS.find((p) => p.slug === slug);
  },

  getAssessments(): Assessment[] {
    return MOCK_ASSESSMENTS;
  },

  getAssessmentBySlug(slug: string): Assessment | undefined {
    return MOCK_ASSESSMENTS.find((a) => a.slug === slug);
  },

  getPlans(): SubscriptionPlan[] {
    return MOCK_SUBSCRIPTION_PLANS;
  },
};

