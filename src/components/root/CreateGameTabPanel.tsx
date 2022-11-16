import { Tab } from "@headlessui/react";
import { FormEventHandler } from "react";

const CreateGameTabPanel = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
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
      </form>
      <button form="form" className="btn-primary btn w-full">
        Create
      </button>
    </Tab.Panel>
  );
};

export default CreateGameTabPanel;
