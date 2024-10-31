import { Button } from "@/components/ui/button";
import BaseModal from "@/components/ui/modal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getImageData, useMintImage } from "@/lib/mintbase";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  // selectedThing: Thing | undefined;
}

export const MintForm = () => {
  const { form, onSubmit, preview, setPreview } = useMintImage();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-2"></div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-2"></div>
        {preview && (
          <img
            src={preview as string}
            alt="Selected Preview"
            style={{
              maxWidth: "330px",
              marginTop: "10px",
              marginBottom: "10px"
            }}
          />
        )}
        <FormField
          control={form.control}
          name="media"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="picture"
                  type="file"
                  {...rest}
                  onChange={(event) => {
                    const { files, displayUrl } = getImageData(event);
                    setPreview(displayUrl);
                    onChange(files);
                  }}
                  className="file:border-grey-700 file:rounded-md file:border file:border-solid file:bg-black file:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Mint Me </Button>
      </form>
    </Form>
  );
};

export const MintModal: React.FC<MintModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Mint Item">
      <MintForm />
    </BaseModal>
  );
};
