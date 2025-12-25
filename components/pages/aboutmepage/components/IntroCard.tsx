import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { MailIcon as Mail, InstagramIcon, BlogIcon, HeartBandageIcon } from "../icons/icons";
import { motion } from "framer-motion";
import type { Profile } from "../types";

const defaultProfile: Profile = {
  name: "방하연 (Hayeon Bang)",
  role: "학생",
  location: "대한민국 서울",
  shortBio:
    "사랑 노래처럼 살아가고자 합니다.",
  interests: ["예술 작품 만들기/보기", "고래", "달", "감성", "지브리 스튜디오 애니메이션", "<The Zone of Interest>", "생각하기", "자연 속에서 혼자 시간 보내기", "바다", "노을", "영화", "노래", "카페에서 과제하기", "겨울", "눈", "사람 관찰하기", "새로움", "친구 얘기 들어주기", "사랑"],
  email: "hayeonwhale07@gmail.com",
  blog: "https://blog.naver.com/storyofthelostletter",
  instagram: "https://www.instagram.com/rhfoyhb/",
};

interface IntroCardProps {
  profile?: Profile;
}

const IntroCard: React.FC<IntroCardProps> = ({ profile = defaultProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-sm mx-auto w-full"
    >
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-br from-white to-slate-50 p-6">
          <div className="flex items-center gap-4">
            {/* 아바타 */}
            <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center p-1 border">
              <HeartBandageIcon className="w-full h-full text-slate-200" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold leading-tight text-slate-800">
                {profile.name}
              </h2>
              <p className="text-sm text-slate-600">{profile.role}</p>
              <p className="text-xs text-slate-500 mt-1">{profile.location}</p>
            </div>
          </div>

          <CardContent className="px-0 pt-4">
            <p className="text-sm text-slate-700 mt-2">{profile.shortBio}</p>

            <div className="mt-4">
              <h3 className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                관심사・좋아하는 것
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map((it) => (
                  <span
                    key={it}
                    className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button asChild className="flex-1">
                <a href={`mailto:${profile.email}`} aria-label="이메일 보내기">
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={16} />
                    <span className="text-sm">메일 보내기</span>
                  </div>
                </a>
              </Button>

              <Button asChild variant="outline">
                <a href={profile.blog} target="_blank" rel="noreferrer">
                  <div className="flex items-center gap-2">
                    <BlogIcon size={16} />
                    <span className="text-sm">블로그</span>
                  </div>
                </a>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>프로필 업데이트: 2025-09-27</span>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-800 transition-colors"
              >
                <InstagramIcon size={14} />
                <span>인스타그램</span>
              </a>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

export default IntroCard;
