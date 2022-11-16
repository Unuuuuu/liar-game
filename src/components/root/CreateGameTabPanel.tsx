import { Tab } from "@headlessui/react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FieldValues {
  name: string;
}

const CreateGameTabPanel = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);

  return (
    <Tab.Panel>
      <form
        id="form"
        className="mb-4 flex flex-col gap-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            className="input-bordered input w-full focus:outline-none"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <label className="label mt-1 py-0">
              <span className="label-text text-xs text-error">
                {errors.name.message}
              </span>
            </label>
          )}
        </div>
      </form>
      <button form="form" className="btn-primary btn w-full">
        Create
      </button>
    </Tab.Panel>
  );
};

export default CreateGameTabPanel;
