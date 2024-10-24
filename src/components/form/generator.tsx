import Form from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { templates } from "./templates";
import { widgets } from "./widgets";

const uiSchema = {
  // globals for determining what to render
  schema: {
    // ("schema" property will resolve to a JsonEditorWidget)
    "ui:widget": "JsonEditorWidget"
  },
  media: {
    "ui:widget": "ImageUploadWidget"
  }
};

export const FormGenerator = ({
  schema,
  onSubmit
}: {
  schema: RJSFSchema;
  onSubmit: () => void;
}) => {
  return (
    <Form
      schema={schema}
      validator={validator}
      uiSchema={uiSchema}
      widgets={widgets}
      templates={templates}
      onSubmit={onSubmit}
      showErrorList="top"
    />
  );
};
