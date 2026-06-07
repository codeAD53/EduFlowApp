import { useState } from "react";
import toast from "react-hot-toast";

import type {
  ProgressStatus,
  RoadmapProgress,
} from "../types";

import {
  updateProgress,
} from "../services/progress.services";

export const useTopicProgress = (
  setProgress: React.Dispatch<
    React.SetStateAction<RoadmapProgress | null>
  >
) => {
  const [updatingTopic, setUpdatingTopic] =
    useState<number | null>(null);

  const handleProgressUpdate = async (
    topicId: number,
    status: ProgressStatus
  ) => {
    setUpdatingTopic(topicId);

    try {
      await updateProgress(
        topicId,
        status
      );

      setProgress((prev) => {
        if (!prev) return prev;

        const updatedTopics =
          prev.topics.map((t) =>
            t.topic_id === topicId
              ? { ...t, status }
              : t
          );

        const completed =
          updatedTopics.filter(
            (t) =>
              t.status === "completed"
          ).length;

        const totalTopics = updatedTopics.length;
        const percentage =
          Math.round(
            (completed /
              totalTopics) *
              100
          );

          const wasCompleted = prev.completion_percentage === 100;
          if(percentage === 100 && !wasCompleted){
            toast.success("🎉 Roadmap Completed! Congratulations!")
          }

        return {
          ...prev,
          topics: updatedTopics,
          completed_topics:
            completed,
          completion_percentage:
            percentage,
        };
      });

      toast.success(
        status === "completed"
          ? "Topic completed!"
          : status === "in_progress"
          ? "Marked as in progress"
          : "Marked as not started"
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to update progress"
      );
    } finally {
      setUpdatingTopic(null);
    }
  };

  return {
    updatingTopic,
    handleProgressUpdate,
  };
};