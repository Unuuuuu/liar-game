import { Tab } from "@headlessui/react";
import JoinGameTabPanel from "~/components/root/JoinGameTabPanel";
import CreateGameTabPanel from "~/components/root/CreateGameTabPanel";
import Container from "~/components/layout/Container";
import clsx from "clsx";

const Root = () => {
  return (
    <Container>
      <div className="py-16">
        <div className="mb-8 flex flex-col items-center">
          <img src="/joker.svg" className="h-32 w-32" alt="joker" />
          <h1 className="text-4xl">Liar Game</h1>
        </div>
        <Tab.Group>
          <Tab.List className="tabs tabs-boxed">
            {["Join Room", "Create Room"].map((value) => (
              <Tab
                key={value}
                className={({ selected }) =>
                  clsx("tab grow focus:outline-none", selected && "tab-active")
                }
              >
                {value}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="w-full">
            <JoinGameTabPanel />
            <CreateGameTabPanel />
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Container>
  );
};

export default Root;
