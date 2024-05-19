import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
  Heading,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import "@fontsource/zen-kaku-gothic-new/400.css";
import "@fontsource/zen-kaku-gothic-new/500.css";

type InputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleClick: () => void;
  isLoading: boolean;
};

const text = `人は星空を見上げると 物語を紡ぎ出してきた
星々が織り成す絵は 時間を超えて
常に私たちの想像力をかき立てる
今夜あなたが見上げる星空には どんな物語が浮かび上がるだろう？`;

export const InputModal = (props: InputModalProps) => {
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    prompt,
    setPrompt,
    handleClick,
    isLoading,
  } = props;

  const [qr, setQR] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const startScan = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    const checkQRCode = () => {
      if (!videoRef.current) return;
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code?.data) {
          setPrompt(decodeURIComponent(code.data));
          setQR(code.data);
          stream.getTracks().forEach((track) => track.stop());
        } else {
          requestAnimationFrame(checkQRCode);
        }
      } else {
        requestAnimationFrame(checkQRCode);
      }
    };

    checkQRCode();
  };

  useEffect(() => {
    if (isModalOpen) {
      startScan();
    }
  }, [isModalOpen]);

  useEffect(() => {
    console.log(qr);
    if (qr) {
      console.log("submit");
      setTimeout(() => {
        handleClick();
      }, 500);
    }
  }, [qr]);

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent backgroundColor="#171923" px={4} pt={2}>
        <ModalHeader>
          <Heading
            textAlign="center"
            color="#A0AEC0"
            fontSize="2xl"
            fontWeight="500"
            letterSpacing="0.05em"
            fontFamily="Zen Kaku Gothic New"
          >
            星空に浮かぶストーリー
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Box mb={8} mt={1}>
            {text.split("\n").map((t, i) => (
              <Text
                key={i}
                color="#A0AEC0"
                textAlign="center"
                mb={2}
                letterSpacing="0.02em"
                fontFamily="Zen Kaku Gothic New"
              >
                {t}
              </Text>
            ))}
            <Flex
              width="80%"
              mt={5}
              mx="auto"
              alignItems="center"
              justifyContent="space-between"
            >
              <img
                src="/qr.png"
                alt="qr"
                width="200"
                height="200"
                style={{ display: "block" }}
              />
              <video
                ref={videoRef}
                style={{ display: "block", width: "200px", opacity: 0.5 }}
              ></video>
            </Flex>
          </Box>
          <form onSubmit={(e) => e.preventDefault()} ref={formRef}>
            <Input
              backgroundColor="#1A202C"
              borderColor="#2D3748"
              color="#E2E8F0"
              fontFamily="Zen Kaku Gothic New"
              placeholder="好きな単語を入力するか、QRコードをかざしてください"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={handleClick}
              isLoading={isLoading}
              colorScheme="teal"
              opacity={0.8}
              type="submit"
              width="50%"
              mx="auto"
              display="block"
              mt={6}
              mb={10}
            >
              祈る
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
