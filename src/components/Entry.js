import React from "react";
import styled from "styled-components";

const EntryContainer = styled.div`
  flex: 1;
  flex-direction: column;
  margin-top: 0.75rem;
  margin-left: ${props => (props.focused ? "1rem" : "0rem")};
  margin-right: ${props => (props.focused ? "0rem" : "1rem")};

  transition: margin 300ms;
`;

const MessageBubble = styled.div`
  flex: 1;

  margin-top: 0.25rem;

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: #e6e6e6;
  border-radius: 1rem;

  overflow-wrap: break-word;
`;

const ImageListContainer = styled.div`
  flex: 1;
  flex-direction: row;
`;

const Image = styled.img`
  margin: 0.3rem;
  height: auto;
  width: 25vw;
  border-radius: 0.5rem;
  background-color: red;
`;

const ImageList = ({ images }) => (
  <ImageListContainer>
    {images.map(i => (
      <Image key={i.url} src={i.url} />
    ))}
  </ImageListContainer>
);

export default ({ innerRef, id, text, images, focused }) => (
  <EntryContainer innerRef={innerRef} focused={focused}>
    <ImageList
      images={[
        { url: "https://placebear.com/200/200" },
        { url: "https://placebear.com/100/100" }
      ]}
    />
    <MessageBubble>
      {id} {text}
    </MessageBubble>
  </EntryContainer>
);
