import { useState } from "react";
import mj from "../images/m&j.jpg";
import { InfinitySpin } from "react-loader-spinner";
import Uploadeer from "../components/Uploader";
import "../css/progress.css";
const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="home">
      <div className="home-left">
        <h1>Help Mark & Joy Capture Every Moment!</h1>
        <p>
          Were you part of their special day? Share the beautiful moments you
          captured by uploading your photos from the wedding. Upload your images
          below and let the memories live on!
        </p>
        <Uploadeer />
      </div>
      <div className="home-right">
        {isLoaded ? null : (
          <InfinitySpin
            visible={true}
            width="200"
            color="#4fa94d"
            ariaLabel="infinity-spin-loading"
          />
        )}
        <img
          src={mj}
          alt="mark and joy"
          onLoad={() =>
            setTimeout(() => {
              setIsLoaded(true);
            }, 1000)
          }
          style={isLoaded ? { display: "block" } : { display: "none" }}
        />
      </div>
    </div>
  );
};

export default Home;
