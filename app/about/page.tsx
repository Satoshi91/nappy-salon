import Link from "next/link";
import { Card, CardContent } from "@/components";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Nappy Salon について
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          「自立から共生へ」― 一人ひとりの成長と、
          <br className="hidden sm:block" />
          仲間との協力で未来を創るコミュニティ
        </p>
      </section>

      {/* サロン概要セクション */}
      <section className="py-12">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="py-10 px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              なっぴーサロンとは
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              なっぴーサロンは、主宰者「なっぴー」が運営する
              <strong>「自立から共生」</strong>を目指すオンラインサロンです。
            </p>
            <p className="text-gray-700 leading-relaxed">
              単なる学びの場にとどまらず、医療・介護・食・健康・ビジネスなど多様な分野で
              メンバー同士がサポートし合い、新たな収益や価値を共に創造することを目的としています。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* コンテンツセクション */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          提供コンテンツ
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    マンダラシート
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    自分の思考を言語化・視覚化し、「現在の自分」と「なりたい自分」のギャップを
                    明確にするツール。サロンの全コンテンツの土台となる、活動の核です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🌅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    今朝の一言
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    毎朝5:30〜6:00に配信。数多くの読書や日常の気づきから、
                    夢や目標の達成に役立つフレーズを共有します。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📚</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    マガジンスチール（マガスチ）
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    読書の時間がない人のために、本の重要部分を凝縮。
                    実体験を交えて解説し、即実践につなげるための要約コンテンツです。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📓</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    手帳術と悩み解決
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    夢や長期計画を日々の行動に落とし込む手帳活用術。
                    「時間」「お金」「感情」「目標」などの共通の悩みを具体的に解決します。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ビジョンセクション */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          プロジェクトのビジョン
        </h2>
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="py-10 px-8">
            <p className="text-lg leading-relaxed text-gray-800 mb-6">
              変化の激しい時代において、メンバー同士が「相互依存（協力関係）」を築き、
              <strong>健康・安心・経済的な備え</strong>を共に発展させることで、
              参加者全員の将来を充実させることを目指しています。
            </p>
            <p className="text-gray-600 text-sm">
              このサロンは、起業家・専門家としての経験が凝縮された
              「人生の設計図」を作る場所です。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 料金プランセクション */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          料金プラン
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-amber-700 mb-2">
                ブロンズ
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ¥1,000<span className="text-base font-normal text-gray-500">/月</span>
              </p>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>・今朝の一言</li>
                <li>・コミュニティ参加</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="ring-2 ring-blue-500">
            <CardContent className="text-center py-8">
              <div className="text-xs font-semibold text-blue-600 mb-2">おすすめ</div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                シルバー
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ¥3,000<span className="text-base font-normal text-gray-500">/月</span>
              </p>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>・ブロンズの全機能</li>
                <li>・マガスチ</li>
                <li>・手帳術講座</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                ゴールド
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ¥5,000<span className="text-base font-normal text-gray-500">/月</span>
              </p>
              <ul className="text-gray-600 space-y-2 text-left">
                <li>・シルバーの全機能</li>
                <li>・マンダラシート個別指導</li>
                <li>・悩み解決コンサル</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 text-center">
        <Card className="bg-blue-50">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              一緒に未来を創りませんか？
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              自立から共生へ ― あなたの目標達成と仲間との協力で、
              より豊かな人生を実現しましょう。
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              お問い合わせ
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
