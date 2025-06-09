import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMemberApi, updateMemberApi } from '@/entities';

export const useMemberStore = defineStore(
    'member',
    () => {
        const member = ref(null);

        const setInit = ({ id, role }) => {
            member.value = { id: id, role: role }
        }

        const getMember = async () => {
            // 로그인 되어 있지 않으면 무시
            if (member.value == null) return;
            // 이미 사용자 정보가 있으면 무시
            if (member.value.username != null) return;

            const data = await getMemberApi({ memberId: member.value.id });
            
            if (data === false) return;
            
            member.value = {
                ...member.value,
                username: data.username,
                nickname: data.nickname,
                birthday: data.birthday,
                gender: data.gender,
                tel: data.tel,
                role: data.role
            };
        }

        // TODO: API 호출
        const tryUpdateMember = async (newMember) => {
            const data = await updateMemberApi(newMember);

            if (data === false) return false;

            member.value = {
                ...member.value,
                nickname: data.nickname,
                birthday: data.birthday,
                gender: data.gender,
                tel: data.tel,
                role: data.role
            };
            return true;
        }

        const clear = () => {
            member.value = null;
        }

        return { member, setInit, getMember, tryUpdateMember, clear };
    },
    { persist: true }
);