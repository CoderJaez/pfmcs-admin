import * as yup from "yup";

export const CriteriaAssessmentSchema = yup.object({
  temperature: yup.string().required("Temperature is required"),
  humidity: yup.string().required("Humidity is required"),
  ammonia: yup.string().required("Ammonia is required"),
  assessment: yup.string().required("Assessment is required"),
  recommendations: yup.string().required("Recommendations is required"),
});
