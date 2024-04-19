const OFFERS = [
  {
    id: 1,
    title: "One time offer",
    productTitle: "Body Wash",
    productImageURL:
      "https://44zww8u3o6gtajyl-60718973068.shopifypreview.com/cdn/shop/products/BodyWash-2_600x600.jpg", // Replace this with the product image's URL.
    productDescription: ["This PREMIUM snowboard is so SUPER DUPER awesome!"],
    originalPrice: "2000.00",
    discountedPrice: "2000.00",
    changes: [
      {
        type: "add_variant",
        variantID: 42629701763212, // Replace with the variant ID.
        quantity: 1,
        discount: {
          value: 15,
          valueType: "percentage",
          title: "15% off",
        },
      },
    ],
  },
];

/*
 * For testing purposes, product information is hardcoded.
 * In a production application, replace this function with logic to determine
 * what product to offer to the customer.
 */
export function getOffers() {
  return OFFERS;
}

/*
 * Retrieve discount information for the specific order on the backend instead of relying
 * on the discount information that is sent from the frontend.
 * This is to ensure that the discount information is not tampered with.
 */
export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}
