import "../css/gallery.css";
import { useEffect, useState, useRef } from "react";
import { db } from "../db/conifg";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const IMAGE_LIMIT = 20;
  const observer = useRef();

  useEffect(() => {
    const getInitialImages = async () => {
      try {
        setIsFetching(true);
        const q = query(collection(db, "pictures"), limit(IMAGE_LIMIT));
        const querySnapshot = await getDocs(q);

        const imgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImages(imgs);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching initial images:", error);
        setIsFetching(false);
      }
    };

    getInitialImages();
  }, []);

  const fetchMoreImages = async () => {
    if (isFetching || !lastVisible) return;

    try {
      setIsFetching(true);
      const q = query(
        collection(db, "pictures"),
        startAfter(lastVisible),
        limit(IMAGE_LIMIT)
      );
      const querySnapshot = await getDocs(q);

      const newImages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching more images:", error);
      setIsFetching(false);
    }
  };

  // Intersection observer for infinite scroll
  const lastImageRef = (node) => {
    if (isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreImages();
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <div className="gallery">
      <h2>Captured Moments</h2>
      <br></br>
      <div className="image-container">
        {images.map((img, index) => (
          <img
            ref={index === images.length - 1 ? lastImageRef : null}
            src={img.pic}
            alt="m&j"
            loading="lazy"
            key={img.id}
          />
        ))}
      </div>
      {isFetching && <p>Loading more images...</p>}
    </div>
  );
};

export default Gallery;
