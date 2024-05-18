import { Box, Text, useDisclosure, IconButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { P5Canvas } from "../components/P5Canvas";
import { InputModal } from "../components/InputModal";
import { CiMenuBurger } from "react-icons/ci";
import "@fontsource/kaisei-opti";

const positions = [
  { x: 10, y: -5, size: 20, rotate: -80 },
  { x: -10, y: 30, size: 30, rotate: 20 },
  { x: 15, y: 80, size: 40, rotate: -10 },
  { x: 70, y: 65, size: 30, rotate: -30 },
  { x: 75, y: 25, size: 20, rotate: 80 },
];

export default function Home() {
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const [isLoadedImgBlob, setIsLoadedImgBlob] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [chatResult, setChatResult] = useState<string[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const [indexOfOpacityRandomImages, setIndexOfOpacityRandomImages] =
    useState<number>(-1);
  const [indexOfOpacityText, setIndexOfOpacityText] = useState<number>(0);
  const [randomImages, setRandomImages] = useState<string[]>([]);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  useEffect(() => {
    onModalOpen();
  }, [onModalOpen]);

  const handleClick = async () => {
    console.log("prompt", prompt);
    if (!prompt) return;
    onModalClose();
    setUrl(null);
    setPrompt("");
    setChatResult([]);
    setIndexOfOpacityRandomImages(-1);
    setIndexOfOpacityText(-1);
    setIsLoadedImgBlob(false);
    setReady(false);

    setLoadingImage(true);
    setLoadingChat(true);

    const chatResponse = await fetch(
      `/api/chat?prompt=${encodeURIComponent(prompt)}`
    );
    const chatData = await chatResponse.json();
    const chatArray = chatData.response.replace(/\n+/g, "\n").split("\n");
    const newChatArray: string[] = [""];
    if (chatArray.length > 6) {
      chatArray.forEach((sentence: string) => {
        const s = newChatArray[newChatArray.length - 1] + sentence;
        if (s.length < 30) {
          newChatArray[newChatArray.length - 1] = s;
        } else {
          newChatArray.push(sentence);
        }
      });
    } else {
      newChatArray.push(...chatArray);
    }
    setChatResult(newChatArray);
    setLoadingChat(false);

    let txtI = 0;
    const txtInterval = setInterval(() => {
      setIndexOfOpacityText(txtI++);
      if (txtI > chatData.response.replace(/\n+/g, "\n").split("\n").length) {
        clearInterval(txtInterval);
      }
    }, 2500);

    setTimeout(() => {
      const rndImgs: string[] = [];
      while (rndImgs.length < 5) {
        const randomNumber = Math.floor(Math.random() * 9) + 1; // 1~9の整数を生成
        if (!rndImgs.includes(`/${randomNumber}.png`)) {
          rndImgs.push(`/${randomNumber}.png`);
        }
      }
      setRandomImages(rndImgs);

      let i = 0;
      const interval = setInterval(() => {
        setIndexOfOpacityRandomImages(i++);
        if (i > 4) {
          clearInterval(interval);
          setReady(true);
          setTimeout(() => {
            onModalOpen();
          }, 1000 * 45);
        }
      }, 2000);
    }, 2500 * newChatArray.length);

    console.log("chatData", chatData);

    const imgUrlresponse = await fetch(
      `/api/dalle?prompt=${encodeURIComponent(prompt)}`
    );
    const data = await imgUrlresponse.json();

    setUrl(data.imageUrl);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoadedImgBlob(true);
  };

  useEffect(() => {
    if (isLoadedImgBlob && ready) {
      setTimeout(() => {
        setLoadingImage(false);
      }, 3000);
    }
  }, [isLoadedImgBlob, ready]);

  const toggleModal = () => {
    isModalOpen ? onModalClose() : onModalOpen();
  };

  return (
    <Box width="100%" height="100vh" overflow="hidden" position="relative">
      <title>星空に浮かぶストーリー</title>
      <IconButton
        onClick={toggleModal}
        icon={<CiMenuBurger />}
        aria-label="menu"
        position="absolute"
        top={4}
        left={4}
        backgroundColor="#fff1"
        color="#ccc"
        size="lg"
        _hover={{ color: "#fff", backgroundColor: "#fff1" }}
        zIndex={100}
      />
      <InputModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        prompt={prompt}
        setPrompt={setPrompt}
        handleClick={handleClick}
        isLoading={loadingChat || loadingImage}
      />
      <Box width="100%" height="100vh">
        <Box
          position="absolute"
          top="2vh"
          left="0"
          width="100%"
          zIndex={10}
          textAlign="center"
        >
          {chatResult.map((sentence) => {
            return (
              <Text
                key={sentence}
                color="#fff"
                fontFamily="'Kaisei Opti', serif;"
                fontSize={24}
                lineHeight={2}
                opacity={
                  chatResult.indexOf(sentence) <= indexOfOpacityText ? 0.8 : 0
                }
                style={{ transition: "opacity 1s" }}
              >
                {sentence}
              </Text>
            );
          })}
        </Box>
        <Box position="absolute" top="0" left="0">
          <P5Canvas />
        </Box>
        {randomImages.map((img, i) => (
          <Box
            key={i}
            position="absolute"
            top={positions[i].y + "vh"}
            left={positions[i].x + "vw"}
            transform={`rotate(${positions[i].rotate}deg)`}
            width={positions[i].size + "vw"}
            style={{ transition: "opacity 3s" }}
            opacity={i <= indexOfOpacityRandomImages ? 0.5 : 0}
          >
            <img src={img} alt="random" />
          </Box>
        ))}
        <Box
          position="absolute"
          top="30vh"
          right="calc(50vw - 30vh)"
          height="70vh"
          width="70vh"
          opacity={loadingImage ? 0 : 0.9}
          style={{ transition: "opacity 5s", mixBlendMode: "lighten" }}
        >
          {url && (
            <img
              src={url}
              onLoad={onImageLoad}
              alt={prompt}
              style={{
                filter: " saturate(10%) contrast(200%) brightness(70%)",
                transform: "rotate(5deg)",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
