import React from "react";
import {
  ChatBubbleMessage,
  ChatBubble,
} from "~/app/components/main/chats/chat-bubble";
import { type MessageType } from "~/app/components/main/chats/types";
import Markdown from "react-markdown";

export type MessageDiagnosisProps = {
  total: number;
  indexBlock: number;
  title: string;
  section: string;
  clinicalCaseMessage: string;
  diagnosisText: string;
  diagnosisLLMindText: string;
};

export const MessageDiagnosis = (
  messageDiagnosisProps: MessageDiagnosisProps,
) => {
  const {
    total,
    indexBlock,
    title,
    section,
    clinicalCaseMessage,
    diagnosisText,
    diagnosisLLMindText,
  } = messageDiagnosisProps;
  return (
    <ChatBubble className="max-w-[100%] flex-col" variant="received">
      <ChatBubbleMessage className="flex flex-col gap-2" isLoading={false}>
        <div className="flex flex-row justify-between">
          <h1 className="mb-2 bg-gray-60 text-sm font-bold text-forest-green-800">
            {title} ~ Diagnosis {indexBlock} on {total}
          </h1>
          <span>
            Section:{" "}
            <span className="font-bold text-forest-green-800">{section}</span>
          </span>
        </div>

        {/* Introduction */}
        <div className="bg-background-introduction flex flex-col whitespace-pre-wrap break-words rounded p-2 text-xs">
          <h3 className="mb-2 text-sm font-bold text-forest-green-800">
            Introduction
          </h3>
          <Markdown>{clinicalCaseMessage}</Markdown>
        </div>
        {/* Diagnosis */}
        <div className="bg-background-diagnosis flex flex-col whitespace-pre-wrap break-words rounded p-2 text-xs">
          <h3 className="mb-2 text-sm font-bold text-forest-green-800">
            Diagnosis
          </h3>
          <Markdown>{diagnosisText}</Markdown>
        </div>
        {/* LLMind Diagnosis */}
        <div className="bg-background-llmind-diagnosis flex flex-col whitespace-pre-wrap break-words rounded p-2 text-xs">
          <h3 className="mb-2 text-sm font-bold text-forest-green-800">
            LLMind Diagnosis
          </h3>
          <Markdown>{diagnosisLLMindText}</Markdown>
        </div>
      </ChatBubbleMessage>
    </ChatBubble>
  );
};

export default MessageDiagnosis;
