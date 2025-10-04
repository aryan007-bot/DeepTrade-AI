// "use client";

// This component is currently disabled because MESSAGE_BOARD_ABI is undefined
// Uncomment and configure when the message board contract is deployed

// import { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useWalletClient } from "@thalalabs/surf/hooks";
// import { toast } from "@/components/ui/use-toast";
// import { aptosClient } from "@/utils/aptosClient";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { getMessageContent } from "@/view-functions/getMessageContent";
// import { MESSAGE_BOARD_ABI } from "@/utils/message_board_abi";

export function MessageBoard() {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-lg font-medium">Message Board (Coming Soon)</h4>
      <p className="text-gray-400">This feature is currently under development.</p>
    </div>
  );
}