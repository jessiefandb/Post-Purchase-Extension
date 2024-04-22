import { json } from "@remix-run/node";

import { authenticate, unauthenticated } from "../shopify.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  await authenticate.public(request)
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  const { cors, sessionToken } = await authenticate.public.checkout(request, { corsHeaders: ["X-My-Custom-Header"] });

  const shop = sessionToken.input_data.shop.domain;
  const { admin } = await unauthenticated.admin(shop);

  const response = await admin.graphql(
    `#graphql
    query getProductIdFromHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        legacyResourceId
        title
        featuredImage {
          url
        }
        variants(first: 1) {
          edges {
            node {
              price
              compareAtPrice
              id
              legacyResourceId
            }
          }
        }
      }
    }`,
    {
      variables: {
        "handle": "candy-cane"
      },
    },
  );

  const initialOffers = await response.json();
  const offers = convert(initialOffers)

  console.log(offers)

  return cors(json({ offers }));
};

function convert(initialOffers) {
  const offers = []
  const offerProduct = initialOffers.data.productByHandle
  const offerVariant = offerProduct.variants.edges[0].node
  offers.push({
    id: Number(offerProduct.legacyResourceId),
    title: "One time offer",
    productTitle: offerProduct.title,
    productImageURL: offerProduct.featuredImage.url,
    productDescription: ["This PREMIUM snowboard is so SUPER DUPER awesome!"],
    originalPrice: offerVariant.price,
    discountedPrice: offerVariant.price,
    changes: [
      {
        type: "add_variant",
        variantID: Number(offerVariant.legacyResourceId),
        quantity: 1,
        discount: {
          value: 15,
          valueType: "percentage",
          title: "15% off",
        }
      }
    ]
  })
  return offers
}
