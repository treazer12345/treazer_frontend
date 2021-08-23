import React from "react";
import Carousel from "react-material-ui-carousel";

const ImageSlider = ({ images }) => {
  return (
    <Carousel
      animation='slide'
      interval={2000}
      navButtonsAlwaysInvisible={true}>
      {images.map((item, i) => (
        <img
          key={i}
          src={item}
          style={{
            height: 150,
            width: "95%",
            resizeMode: "cover",
            borderRadius: 20,
            boxShadow: "0px 4px 4px 0px #C9CCD1, 0px 0px 2px #C9CCD1",
            marginLeft: 10,
            marginTop: 5,
          }}
        />
      ))}
    </Carousel>
  );
};

export default ImageSlider;
