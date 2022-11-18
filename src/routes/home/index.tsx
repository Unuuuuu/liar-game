import React from "react";
import Container from "~/components/Container";
import Logo from "./Logo";
import Tabs from "./Tabs";

const Home = () => {
  return (
    <Container>
      <div className="flex flex-col gap-12 py-16">
        <Logo />
        <Tabs />
      </div>
    </Container>
  );
};

export default Home;
