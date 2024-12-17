"use client";
import { ChatList } from "~/app/components/main/chat/chat-list";
import { Send } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "~/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/components/ui/form";
const formSchema = z.object({
  message: z.string().min(1, {
    message: "Text message must be at least 1 character",
  }),
});

export const Chat = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }
  return (
    <div className="bg-gray-10 relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden">
      <h1 className="text-forest-green-700 overflow-hidden p-4 align-top font-bold">
        Clinical Cases
      </h1>
      <ChatList
        isLoading={false}
        messages={[
          {
            id: 1,
            role: "AI",
            text: "Juanita Delgado, a single, unemployed Hispanic woman, sought therapy at age 33 for treatment of depressed mood, chronic suicidal thoughts, social isolation, and poor personal hygiene. She had spent the prior 6 months isolated in her apartment, lying in bed, eating junk food, watching television, and doing more online shopping than she could afford. Multiple treatments had yielded little effect. Ms. Delgado was the middle of three children in an upper-middle-class immigrant family in which the father reportedly valued professional achievement over all else ",
            timestamp: new Date(),
            hasValidation: false,
            messageType: "CLINICAL",
            title: "Clinical Case 1",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 2,
            role: "AI",
            text: "Based on the provided information, Juanita Delgado's symptoms suggest a diagnosis of Borderline Personality Disorder (6A10) according to ICD-11. Her history of unstable relationships, intense anger, impulsivity (self-harm, substance use), chronic feelings of emptiness, and difficulty regulating emotions align with the diagnostic criteria for this disorder. The presence of brief manic episodes further supports this diagnosis.",
            timestamp: new Date(),
            hasValidation: true,
            messageType: "DIAGNOSIS",
            title: "Diagnosis 1",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 3,
            role: "USER",
            text: "The answer has been validated as correct ",
            timestamp: new Date(),
            hasValidation: false,
            title: "",
            messageType: "DEFAULT",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 4,
            role: "AI",
            text: "Validate the answer with a score from 0 to 1 ",
            timestamp: new Date(),
            hasValidation: false,
            title: "",
            messageType: "DEFAULT",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 5,
            role: "USER",
            text: "0.5",
            timestamp: new Date(),
            hasValidation: false,
            title: "",
            messageType: "DEFAULT",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 6,
            role: "AI",
            text: "Would you like to add any additional notes?",
            timestamp: new Date(),
            hasValidation: false,
            title: "",
            messageType: "DEFAULT",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 7,
            role: "USER",
            text: "Lorem Ipsum",
            timestamp: new Date(),
            hasValidation: false,
            title: "",
            messageType: "DEFAULT",
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
        ]}
      />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt- relative m-4 flex flex-1 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk="dashboard-03-chunk-1"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              className="text-gray-40 ml-auto mr-3 gap-1.5 self-center bg-transparent"
            >
              <Send size={24} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
