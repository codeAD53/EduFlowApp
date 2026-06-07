import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  Roadmap,
  RoadmapProgress,
} from "../types";

import {
  getRoadmapById,
} from "../services/roadmap.services";

import {
  getRoadmapProgress,
} from "../services/progress.services";

import toast from "react-hot-toast";

export const useRoadmapView = (
  roadmapId?: number
) => {
  const navigate = useNavigate();

  const [roadmap, setRoadmap] =
    useState<Roadmap | null>(null);

  const [progress, setProgress] =
    useState<RoadmapProgress | null>(null);

  const [isLoading, setIsLoading] =
    useState(() => Boolean(roadmapId));

  useEffect(() => {
    if (!roadmapId) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const [
          roadmapData,
          progressData,
        ] = await Promise.all([
          getRoadmapById(roadmapId),
          getRoadmapProgress(roadmapId),
        ]);

        setRoadmap(roadmapData);
        setProgress(progressData);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load roadmap"
        );

        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roadmapId, navigate]);

  return {
    roadmap,
    progress,
    setProgress,
    isLoading,
  };
};