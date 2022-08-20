import {useProductOptions, Image} from '@shopify/hydrogen';
import Aos from 'aos';
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

  return (
    <>
      {selectedImages?.map((selectedImage, index) => {
        return (
          <div className="mb-12 animate-up" id={index} key={selectedImage?.id}>
            <Image
              width="100%"
              height="100%"
              className="is-animated fadeInUp"
              alt={selectedImage?.image?.altText ?? 'Recommended Product'}
              src={selectedImage?.image?.url as string}
            />
          </div>
        );
      })}
    </>
  );
}
