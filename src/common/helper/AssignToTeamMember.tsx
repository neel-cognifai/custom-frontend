import React, { use, useEffect, useState } from "react";
import { STATUS, TeamName } from "../constants";
import { useAppSelector } from "@/redux/store";
import { AbstractReviewDataState } from "@/components/abstract-review/abstract-review.slice";
import { TeamMember } from "@/components/abstract-review/abstract.model";

interface AssignToTeamMemberProps {
  onAssign: (selectedTeamMember: string) => void;
}

const AssignToTeamMember: React.FC<AssignToTeamMemberProps> = ({
  onAssign,
}) => {
  const [teamUsersData, setTeamUserData] = useState<TeamMember[]>([])
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { status, teamUsers } = useAppSelector(AbstractReviewDataState);

useEffect(() => {
 if(status === STATUS.fulfilled){
  setTeamUserData(teamUsers)
 }
},[status, teamUsers])

  const handleAssignClick = async () => {
    onAssign(selectedValue)
    setSelectedValue("")
  };

  return (
    <>
      <div className="ml-3 mt-3 font-semibold">Assign to a Team Member :</div>
      <div className="w-[20%] relative ml-2 mt-1">
        <select
          value={selectedValue}
          className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value={""}>Select Team Member</option>
          {teamUsersData?.map((name, index) => (
            <option key={index} value={name.user_id}>
              {name.user_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-1 ml-1">
        <button
          className="text-14 bg-violet text-white border-none rounded-md cursor-pointer w-28 h-[35px]"
          disabled ={!selectedValue}
          onClick={handleAssignClick}
        >
          Assign
        </button>
      </div>
    </>
  );
};

export default AssignToTeamMember;
