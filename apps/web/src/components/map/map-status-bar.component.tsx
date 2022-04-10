import { SkillRouteType } from '@packages/scenario-routing';
import * as _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mapMovingDelayTimeMS } from '../../common/timing';
import { MapBlock, useMap, useSkillLogs } from '../../libs';
import { currentSkillRouteAtom } from './current-skill-route.atom';

function endlessSlice(arr: any[], from: number, to: number) {
  if (from >= to) {
    return [...arr, ...arr, ...arr].slice(from, arr.length + to);
  }

  if (to > arr.length) {
    return [...arr, ...arr].slice(from, to);
  }

  return arr.slice(from, to);
}

function getSkillRouteIndexBySkillGroup(
  map: MapBlock[],
  findingSkillRoute: SkillRouteType,
) {
  return _.findIndex(
    map.map((stop) => stop.skillRoute),
    (skillRoute) =>
      skillRoute.scenarioName == findingSkillRoute.scenarioName &&
      skillRoute.skillGroupName == findingSkillRoute.skillGroupName,
  );
}

function getRelativeMovingCount(
  mapLength: number,
  fromIndex: number,
  toIndex: number,
) {
  return fromIndex > toIndex
    ? mapLength + toIndex - fromIndex
    : toIndex - fromIndex;
}

export const MAP_TRANSITION_DURATION_MS = 2000;

export const MapStatusBar: React.FC = () => {
  const { data: mapStops } = useMap();
  const { data: skillLogs } = useSkillLogs();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isInitalized, setIsInitalized] = useState(false);
  const [left, setLeft] = useState(0);
  const [relativeMovingCount, setRelativeMovingCount] = useState(-1);

  const [zoomedMap, setZoomedMap] = useState<MapBlock[]>([]);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setLeft(node.offsetLeft);
    }
  }, []);

  const currentSkillRoute = useRecoilValue(currentSkillRouteAtom);

  useEffect(() => {
    if (mapStops !== undefined && currentSkillRoute !== undefined) {
      const sliceRange = mapStops.length;

      const currentSkillRouteIndex =
        currentSkillRoute !== null
          ? getSkillRouteIndexBySkillGroup(mapStops, currentSkillRoute)
          : 0;

      if (isInitalized == true) {
        const prevSkillRoute = zoomedMap[0].skillRoute;
        const prevSkillRouteIndex = getSkillRouteIndexBySkillGroup(
          mapStops,
          prevSkillRoute,
        );

        const relativeMovingCount = getRelativeMovingCount(
          mapStops.length,
          prevSkillRouteIndex,
          currentSkillRouteIndex,
        );

        setRelativeMovingCount(relativeMovingCount);

        setZoomedMap(
          endlessSlice(
            mapStops,
            prevSkillRouteIndex,
            prevSkillRouteIndex + relativeMovingCount + sliceRange,
          ),
        );

        setTimeout(() => {
          setRelativeMovingCount(-1);
          setIsTransitioning(false);
          setZoomedMap(
            endlessSlice(
              mapStops,
              currentSkillRouteIndex,
              currentSkillRouteIndex + sliceRange,
            ),
          );
          setLeft(0);
          setTimeout(() => {
            setIsTransitioning(true);
          }, 100);
        }, mapMovingDelayTimeMS);
      } else {
        setZoomedMap(
          endlessSlice(
            mapStops,
            currentSkillRouteIndex,
            currentSkillRouteIndex + sliceRange,
          ),
        );
      }

      setIsInitalized(true);
    }
  }, [currentSkillRoute, mapStops]);

  return mapStops && skillLogs ? (
    <div className="relative overflow-x-hidden md:h-6 h-4 flex-grow leading-none">
      <div
        className="absolute flex md:gap-x-8 gap-x-1.5"
        style={{
          left: `-${left}px`,
          transitionProperty: 'left',
          transitionDuration: isTransitioning
            ? `${mapMovingDelayTimeMS}ms`
            : '0s',
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        {zoomedMap.map((stop, index) => (
          <div
            className={`${
              index == 0
                ? 'font-extrabold text-black dark:text-zinc-200'
                : 'font-medium text-gray-700 dark:text-zinc-400'
            } whitespace-nowrap tracking-tighter`}
            ref={index == relativeMovingCount ? measuredRef : undefined}
            key={`${stop.skillRouteUrl}${index}`}
          >
            {stop.alias}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
