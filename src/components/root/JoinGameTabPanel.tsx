import { Tab } from "@headlessui/react";
import { FormEventHandler } from "react";

const JoinGameTabPanel = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(event.target);
  };

  return (
    <Tab.Panel>
      <form
        id="form"
        className="mb-4 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input type="text" className="input-bordered input w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Room Code</span>
          </label>
          <input type="text" className="input-bordered input w-full" />
        </div>
      </form>
      <button form="form" className="btn-primary btn w-full">
        Join
      </button>
    </Tab.Panel>
  );
};

export default JoinGameTabPanel;
