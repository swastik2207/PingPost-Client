


import { GraphQLClient } from "graphql-request";

const isClient = typeof window!=="undefined";
console.log(isClient);

export const graphqlClient = new GraphQLClient(
   process.env.NEXT_PUBLIC_API_URL as string ,

  {
    headers:()=>( {
     Authorization: isClient
       ? `Bearer ${window.localStorage.getItem("__PingPost_token")}`
        : "",
    }),
    
  }
   
);