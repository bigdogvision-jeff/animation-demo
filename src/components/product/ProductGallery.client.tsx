import {useProductOptions, Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

function splitOnForwardSlash(text: string | undefined) {
  return text?.split('/')?.[0].replace(' ', '').toLowerCase() ?? '';
}

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media}: {media: MediaEdge['node'][]}) {
  const {variantsConnection, selectedOptions, setSelectedOption} =
    useProductOptions();
  const [scrollPosition, setScrollPosition] = useState(0);

  let selectedImages = media;
  if (selectedOptions?.colorSelected) {
    selectedImages = variantsConnection?.nodes?.filter(
      (node) =>
        splitOnForwardSlash(node?.title) ===
        splitOnForwardSlash(selectedOptions?.Color),
    );
  }

  const [scrollY, setScrollY] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      if (window.scrollY > 0 && !hasLoaded) {
        setHasLoaded(true);
        handleStyle();
      }
    };

    // just trigger this so that the initial state
    // is updated as soon as the component is mounted
    // related: https://stackoverflow.com/a/63408216
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleStyle = () => {
    if (window.scrollY > 0) {
      window.document.addEventListener('scroll', function (event) {
        const animatedBoxes =
          window.document.getElementsByClassName('is-animated');

        Array.prototype.forEach.call(animatedBoxes, (animatedBox) => {
          if (isElementInViewport(animatedBox)) {
            addClass(animatedBox, 'fadeInUp');
          }
        });
      });
    }

    const isElementInViewport = (el) => {
      let top = el.offsetTop;
      let left = el.offsetLeft;
      const width = el.offsetWidth;
      const height = el.offsetHeight;

      while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      return (
        top < window.pageYOffset + window.innerHeight &&
        left < window.pageXOffset + window.innerWidth &&
        top + height > window.pageYOffset &&
        left + width > window.pageXOffset
      );
    };

    const addClass = (element, className) => {
      const arrayClasses = element.className.split(' ');
      if (arrayClasses.indexOf(className) === -1) {
        element.className += ' ' + className;
      }
    };
  };

  return (
    <>
      {selectedImages?.map((selectedImage, index) => {
        return (
          <div className="mb-12" id={index} key={selectedImage?.id}>
            <Image
              className={`is-animated ${index === 0 ? 'fadeInUp' : ''}`}
              width="100%"
              height="100%"
              alt={selectedImage?.image?.altText ?? 'Recommended Product'}
              src={selectedImage?.image?.url as string}
            />
          </div>
        );
      })}
    </>
  );
}
