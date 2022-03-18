import { useQuery } from "react-query";
import { getMap } from ".";

export const useMap = () => useQuery(getMap.name, getMap, { retry: false });
