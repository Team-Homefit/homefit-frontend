import { createRouter, createWebHistory } from "vue-router";
import { useMemberStore } from "@/features/member/memberStore";

import MainPage from "@/pages/main/MainPage.vue";
import SignUpPage from "@/pages/signUp/SignUpPage.vue";
import SignInPage from "@/pages/signIn/SignInPage.vue";
import MyPage from "@/pages/my/MyPage.vue";
import PasswordUpdatePage from "@/pages/passwordUpdate/PasswordUpdatePage.vue";
import ReportHistoryPage from "@/pages/reportHistory/ReportHistoryPage.vue";
import BanPage from "@/pages/ban/BanPage.vue";
import DealSearchPage from "@/pages/dealSearch/DealSearchPage.vue";
import HouseDetailPage from "@/pages/houseDetail/HouseDetailPage.vue";
import NotificationListPage from "@/pages/notificationList/NotificationListPage.vue";
import NotificationDetailPage from "@/pages/notificationDetail/NotificationDetailPage.vue";
import BoardListPage from "@/pages/board/BoardListPage.vue";
import ArticleDetailPage from "@/pages/articleDetail/ArticleDetailPage.vue";
import PostArticlePage from "@/pages/article/PostArticlePage.vue";
import ModifyArticlePage from "@/pages/article/ModifyArticlePage.vue";
import LikedArticlePage from "@/pages/likedArticle/LikedArticlePage.vue";
import LoadingPage from "@/pages/loading/LoadingPage.vue";
import ErrorPage from "@/pages/error/ErrorPage.vue";
import PostNotificationPage from "@/pages/notification/PostNotificationPage.vue";
import ModifyNotificationPage from "@/pages/notification/ModifyNotificationPage.vue";
import ChatbotPage from "@/pages/chatbot/ChatbotPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'main',
            meta: { 
                title: 'HOMEFIT',
                requiresNotBan: true
            },
            component: MainPage
        }, {
            path: '/auth',
            children: [
                {
                    path: 'sign-in',
                    name: 'signIn',
                    meta: { title: '로그인' },
                    component: SignInPage
                }, {
                    path: 'sign-up',
                    name: 'signUp',
                    meta: { title: '회원가입' },
                    component: SignUpPage
                }
            ]
        }, {
            path: '/member',
            children: [
                {
                    path: 'my',
                    name: 'my',
                    meta: {
                        title: '마이',
                        requiresAuth: true,
                        requiresNotBan: true
                    },
                    component: MyPage
                }, {
                    path: '/password',
                    name: 'passwordUpdate',
                    meta: { title: '비밀번호 수정' },
                    component: PasswordUpdatePage
                }
            ]
        }, {
            path: '/house',
            meta: { title: '아파트 거래' },
            children: [
                {
                    path: ':id',
                    name: 'houseDetail',
                    component: HouseDetailPage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true
                    }
                }, {
                    path: 'deal',
                    name: 'dealSearch',
                    component: DealSearchPage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true
                    }
                }
            ]
        }, {
            path: '/notification',
            meta: { title: '공지사항' },
            children: [
                {
                    path: '',
                    name: 'notificationList',
                    component: NotificationListPage,
                    meta: { 
                        requiresAuth: true,
                        title: '공지사항 목록',
                        requiresNotBan: true
                    }
                }, {
                    path: ':id',
                    name: 'notificationDetail',
                    component: NotificationDetailPage,
                    meta: { 
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '공지사항 상세',
                    }
                }, {
                    path: 'post',
                    name: 'postNotification',
                    component: PostNotificationPage,
                    meta: { 
                        requiresAuth: true, 
                        requiresAdmin: true,
                        requiresNotBan: true,
                        title: '공지사항 작성'
                    }
                }, {
                    path: 'modify/:id',
                    name: 'modifyNotification',
                    component: ModifyNotificationPage,
                    meta: { 
                        requiresAuth: true, 
                        requiresAdmin: true,
                        requiresNotBan: true,
                        title: '공지사항 수정'
                    }
                }
            ]
        }, {
            path: '/board',
            meta: { title: '게시판' },
            children: [
                {
                    path: '',
                    name: 'boardList',
                    component: BoardListPage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '게시글 목록'
                    }
                }, {
                    path: ':boardId/article/post',
                    name: 'articlePost',
                    component: PostArticlePage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '게시글 작성'
                    }
                }, {
                    path: 'article/:id',
                    name: 'articleDetail',
                    component: ArticleDetailPage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '게시글 상세'
                    }
                }, {
                    path: 'article/:id/modify',
                    name: 'articleModify',
                    component: ModifyArticlePage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '게시글 수정'
                    }
                }, {
                    path: 'article/liked',
                    name: 'articleLiked',
                    component: LikedArticlePage,
                    meta: {
                        requiresAuth: true,
                        requiresNotBan: true,
                        title: '좋아요한 게시글'
                    }
                }
            ]
        }, {
            path: '/report',
            meta: { title: '신고' },
            children: [
                {
                    path: 'history',
                    name: 'reportHistory',
                    component: ReportHistoryPage,
                    meta: {
                        requiresAdmin: true,
                        requiresNotBan: true
                    }
                }, {
                    path: 'ban',
                    name: 'ban',
                    component: BanPage
                }
            ]
        }, {
            path: '/error',
            name: 'error',
            component: ErrorPage,
            // 네비게이션 가드에서는 props를 사용할 수 없음
            props: (route) => ({
                title: route.query.title || '오류가 발생했습니다',
                message: route.query.message || '페이지를 불러오는 중 문제가 발생했습니다.',
                actionText: route.query.actionText || '홈으로 돌아가기'
            }),
            meta: { title: '오류' }
        }, {
            path: '/chatbot',
            name: 'chatbot',
            component: ChatbotPage,
            meta: { 
                title: '챗봇',
                requiresAuth: true,
                hideFooter: true
            }
        }
    ]
});

// 전역 네비게이션 가드
router.beforeEach(async (to, from, next) => {
    const memberStore = useMemberStore();

    if (to.meta.requiresNotBan) {
        if (!memberStore.member) {
            await memberStore.getMember();
        }

        if (memberStore.member && memberStore.member.role === 'BANNED') {
            next({
                name: 'ban',
            });
            return;
        }
    }
    
    // 인증이 필요한 라우트인지 확인
    if (to.meta.requiresAuth) {
        // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
        if (!memberStore.member) {
            next({
                path: '/auth/sign-in',
                query: { redirect: to.fullPath }
            });
            return;
        }

        // member 정보가 없으면 가져오기
        if (!memberStore.member.role) {
            await memberStore.getMember();
            // member 정보를 가져온 후에 role 체크

            // 관리자 권한이 필요한 라우트인지 확인
            if (to.meta.requiresAdmin && memberStore.member.role !== 'ADMIN') {
                next({ 
                    name: 'error',
                    query: {
                        title: '접근 제한',
                        message: '접근 권한이 없습니다.',
                        actionText: '홈으로 돌아가기'
                    }
                });
                return;
            }
        }
    }
    
    next();
});

export default router;