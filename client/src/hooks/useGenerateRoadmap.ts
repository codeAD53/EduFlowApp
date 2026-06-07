import { useState, type ChangeEvent } from "react"
import toast from "react-hot-toast";
import { generateRoadmap } from "../services/roadmap.services";

const initialForm = {
    title: "",
    goal: "",
    level: "",
    duration: ""
};

export const useGenerateRoadmap = () => {
    const [formData, setFormData] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev)=>({...prev, [e.target.name]: e.target.value}));
    };

    const handleSelect = (field: keyof typeof initialForm, value: string) => {
        setFormData((prev)=>({...prev, [field]: value,}));
    };

    const generate = async () => {
    if (!formData.level) {
      toast.error("Please select a level");
      return null;
    }

    if (!formData.duration) {
      toast.error("Please select a duration");
      return null;
    }

    setIsLoading(true);

    try {
      const roadmap = await generateRoadmap(formData);

      toast.success("Roadmap generated successfully!");

      return roadmap;
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to generate roadmap. Try again."
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSelect,
    generate,
  };

}