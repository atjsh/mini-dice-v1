import { SkillRouteType } from '@packages/scenario-routing';
import * as _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (
      mapStops !== undefined &&
      currentSkillRoute !== undefined &&
      mapContainerRef.current
    ) {
      const sliceRange = mapStops.length;

      const currentSkillRouteIndex =
        currentSkillRoute !== null
          ? getSkillRouteIndexBySkillGroup(mapStops, currentSkillRoute)
          : 0;

      if (isInitalized) {
        mapContainerRef.current.scrollLeft = 0;

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

        timeouts.push(
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
          }, mapMovingDelayTimeMS),
        );
        timeouts.push(
          setTimeout(() => {
            setIsTransitioning(true);
          }, mapMovingDelayTimeMS + 100),
        );
      } else {
        setZoomedMap(
          endlessSlice(
            mapStops,
            currentSkillRouteIndex,
            currentSkillRouteIndex + sliceRange,
          ),
        );
      }

      timeouts.push(
        setTimeout(() => {
          setIsInitalized(true);
        }, 1000),
      );
    }

    return () => {
      timeouts.map(clearTimeout);
    };
  }, [currentSkillRoute, mapStops]);

  return mapStops && skillLogs ? (
    <div
      className="relative overflow-x-scroll flex flex-col md:gap-y-1 gap-0 flex-grow leading-none px-2 py-2 rounded-2xl md:px-4 md:py-3 border border-zinc-300 text-black dark:border-zinc-800 dark:text-white select-none"
      ref={mapContainerRef}
    >
      <div
        className=" relative flex"
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
            className={`whitespace-nowrap tracking-tighter pr-2 mr-2 border-r-2 dark:border-zinc-700 border-zinc-400 md:mr-4 md:pr-4 text-left`}
            ref={index == relativeMovingCount ? measuredRef : undefined}
            key={`${stop.skillRouteUrl}${index}`}
          >
            <div
              className={`${
                index == 0
                  ? ' font-extrabold text-black dark:text-zinc-200'
                  : ' font-bold text-zinc-600 dark:text-zinc-400'
              } text-base md:text-xl`}
            >
              {stop.alias}
            </div>
            <div
              className={`text-xs ${
                index === 0
                  ? ' font-bold text-minidice_red dark:text-zinc-400'
                  : ' dark:text-zinc-600 text-zinc-400'
              }`}
            >
              <>{index === 0 ? '현재 칸' : `+${index}칸`}</>
            </div>
          </div>
        ))}
        {zoomedMap.length === 0 && (
          <div className="text-zinc-600 dark:text-zinc-400 pr-2 mr-2 border-r-2 md:mr-4 md:pr-4 whitespace-nowrap tracking-tighter">
            <div className="text-base md:text-xl">불러오는 중</div>
            <div className={`text-xs`}>+1칸</div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
