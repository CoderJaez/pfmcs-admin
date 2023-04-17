import React, { useRef, useEffect, useContext, useState } from "react";
import moment from "moment-timezone";
import { CardLayout } from "../../shared/components/layouts";
import { RecommendationService } from "../../service/recommendationService";
import "../../assets/css/style.css";

const Recommendations = () => {
  const date = moment(new Date()).format(`MMMM DD, YYYY`);
  const [recommendation, setRecommendation] = useState(null);

  const fetchRecommendation = async () => {
    await RecommendationService.GetRecentRecommendation()
      .then((data) => {
        setRecommendation(data);
        console.log(data);
      })
      .catch((err) => {
        console.error("Recommendations:", err.message);
      });
  };

  useEffect(() => {
    fetchRecommendation();
    // const inertvalId =  setInterval(() => {
    // }, 6000);
  }, []);
  return (
    <CardLayout
      title={`Recommendations for ${date}`}
      header_style="card-warning"
    >
      <h5>Average Temperature and humidity</h5>
      {recommendation ? (
        <div className="recommendation">
          <p>
            <strong>Temperature:</strong>{" "}
            {recommendation.temperature.toFixed(2)}℃
          </p>
          <p>
            <strong>Humidity:</strong> {recommendation.humidity.toFixed(2)}%
          </p>
          <p>
            <strong>Ammonia:</strong> {recommendation.ammonia.toFixed(2)} PPM
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {moment(recommendation.dateFrom).format("HH:MM:SS a")} -{" "}
            {moment(recommendation.dateTo).format("HH:MM:SS a")}
          </p>

          <div style={{ marginTop: "1.2rem" }}>
            <p>
              <strong>Assessment: </strong>
              {recommendation.assessment}
            </p>
            <p>
              <strong>Recommendations: </strong>
              {recommendation.recommendations.recommendations}
            </p>
          </div>
        </div>
      ) : null}
    </CardLayout>
  );
};

export default Recommendations;
