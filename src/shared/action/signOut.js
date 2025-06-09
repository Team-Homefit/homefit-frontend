import { signOutApi } from '@/entities';
import { useMemberStore } from '@/features/member/memberStore.js';
import { useInterestedRegionStore } from '@/features/interestedRegion/interestedRegionStore.js';

const signOut = async () => {
  const memberStore = useMemberStore();
  const interestedRegionStore = useInterestedRegionStore();

  const result = await signOutApi();

  if (result === false) {
    return false;
  }

  memberStore.clear();
  interestedRegionStore.clear();
  return true;
}

export { signOut };