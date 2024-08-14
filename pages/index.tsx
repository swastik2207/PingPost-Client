import { Inter } from "next/font/google";
import { ChangeEvent } from "react";
import { SlSocialVkontakte } from "react-icons/sl";
import React, { useCallback, useDebugValue, useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { BiHash, BiImage, BiImageAlt, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import FeedCard from "@/components/FeedCard";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { Token } from "graphql";
import { useCurrentUser } from "@/hooks/user";
import { headers } from "next/headers";
import { useQueryClient } from "@tanstack/react-query";
import { getAllTweets, useCreateTweet } from "@/hooks/tweet";
import PingpostLayout from "@/components/FeedCard/Layout/PingPostLayout";
import { Tweet } from "@/gql/graphql";
import { GetServerSideProps } from "next";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import {app,storage} from "@/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";


const inter = Inter({ subsets: ["latin"] });

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { tweets = [] } = getAllTweets();
  const [content, setContent] = useState("");
  const [imageURL,setImageURL]=useState("");
  const { mutate } = useCreateTweet();
  console.log(tweets);

  console.log(graphqlClient);

  const createUniqueFileName = (getFile:any) => {
    const timeStamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);
  return `${getFile.name}-${timeStamp}-${randomStringValue}`
  }


  async function helperforUploadingImageToFirebase(file:any){
    const getFileName=createUniqueFileName(file);
    const storageReference= ref(storage,`PingPost/${getFileName}`)
    const uploadImage=uploadBytesResumable(storageReference,file);
    return new Promise((resolve, reject) => {
      uploadImage.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref)
            .then((downloadUrl) => resolve(downloadUrl))
            .catch((error) => reject(error));
        }
      );
    });
  
    
  }
  

  const handlerCreateTweet = useCallback(() => {
    mutate({
      content,
      imageURL
    });
  }, [content, mutate]);

  async function handleImage(){

    if (typeof window !== "undefined") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
     
      
      input.click();
       
      input.addEventListener("change", async () => {
        if ( input.files && input.files.length > 0) {
          const selectedFile = input.files[0]; // Access the first selected file
          console.log(selectedFile.name); // Logs the file name
          const extractImageUrl=await helperforUploadingImageToFirebase(selectedFile)
          console.log(extractImageUrl)
          setImageURL(extractImageUrl as string);
        
        }
      });
      
    
    } 


    
  }

  return (
    <div>
      <PingpostLayout>
        <div>
          <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  <img
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                    placeholder="What's happening?"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt onClick={handleImage} className="text-xl" />
                    <button
                      onClick={handlerCreateTweet}
                      className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                    >
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) => (
            <FeedCard data={tweet as Tweet} key={tweet?.id} />
          ))}
        </div>
      </PingpostLayout>
    </div>
  );
}

 const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
