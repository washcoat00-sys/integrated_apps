const video = document.getElementById('video');
const btnCamera = document.getElementById('btn-camera');
const btnCapture = document.getElementById('btn-capture');
const fileUpload = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const placeholder = document.getElementById('placeholder');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result');
const resultCards = document.getElementById('result-cards');

let stream = null;
let modelsLoaded = false;

// face-api.js 모델 로드
async function loadModels() {
    try {
        const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        modelsLoaded = true;
        console.log('Premium AI Expert System Ready.');
    } catch (error) { console.error('Models failed:', error); }
}

loadModels();

// 파일 업로드 처리
fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.classList.remove('hidden');
            video.classList.add('hidden');
            placeholder.classList.add('hidden');
            btnCapture.classList.remove('hidden'); 
        };
        reader.readAsDataURL(file);
    }
});

// 분석 실행
btnCapture.addEventListener('click', async () => {
    if (!modelsLoaded) return;
    loading.classList.remove('hidden');
    resultSection.classList.add('hidden');
    window.scrollTo({ top: loading.offsetTop - 100, behavior: 'smooth' });

    try {
        let inputElement = video.classList.contains('hidden') ? imagePreview : video;
        const detections = await faceapi.detectSingleFace(inputElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        if (!detections) {
            loading.classList.add('hidden');
            alert("얼굴을 찾을 수 없습니다. 정면 사진을 권장합니다.");
            return;
        }

        const analysis = generateAnalysis(detections);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = inputElement.videoWidth || inputElement.naturalWidth;
        canvas.height = inputElement.videoHeight || inputElement.naturalHeight;
        ctx.drawImage(inputElement, 0, 0);
        displayResults(analysis, canvas.toDataURL());
    } catch (err) { loading.classList.add('hidden'); }
});

function generateAnalysis(detections) {
    // 대한민국 최고의 AI 관상 전문가 데이터베이스
    const types = [
        {
            mainTitle: "만인을 호령하는 제왕의 풍모 [호랑이상]",
            oneLine: "기회를 스스로 개척하는 타고난 리더",
            summary: "강한 카리스마와 추진력으로 사회적 정점에 오를 에너지를 가진 관상입니다.",
            
            // 2. 인생 삼단계 대운 (Life Timeline)
            lifeCycle: [
                { stage: "초년운 (상정/0~30세)", desc: "이마가 넓고 평평하며 빛이 나기 때문에, 하늘의 기운을 온전히 받아 일찍부터 학업적 명성과 관직운이 따르는 상입니다." },
                { stage: "중년운 (중정/30~50세)", desc: "콧대가 대들보처럼 곧고 광대가 적절히 받쳐주기 때문에, 인생의 황금기에 강력한 주관으로 막대한 재물과 지위를 쟁취하게 됩니다." },
                { stage: "말년운 (하정/50세 이후)", desc: "견고한 턱선(하관)은 말년의 부하운과 자식덕이 깊음을 의미하기 때문에, 평온한 노후와 안정적인 자산 유지가 보장된 관상입니다." }
            ],

            // 3. 5대 부위(오관)별 정밀 판독
            parts: [
                { title: "눈 (정신/의지)", desc: "눈매가 매섭고 눈빛이 강하기 때문에, 내면의 결단력이 비범하며 어떤 위기 상황에서도 흔들림 없이 목표를 쟁취해냅니다." },
                { title: "눈썹 (인덕/형제)", desc: "눈썹이 짙고 끝이 위로 향했기 때문에, 사람들을 이끄는 리더십이 탁월하며 주변에 뜻을 같이하는 동료들이 끊이지 않습니다." },
                { title: "코 (재물/자아)", desc: "코끝(준두)이 도톰하고 콧방울이 야무지기 때문에, 재물이 모이면 쉽게 빠져나가지 않고 중년 이후 큰 부를 일구는 저력을 가집니다." },
                { title: "입 (신용/말년)", desc: "입술 선이 분명하고 입매가 견고하기 때문에, 한 번 한 말에 책임을 지는 신용이 두터워 사회적으로 높은 신뢰를 받습니다." },
                { title: "귀 (복/수명)", desc: "귓볼이 두툼하고 안쪽 살이 풍만하기 때문에, 타고난 생명력이 강하고 주변의 조언을 수용하여 더 큰 복을 부르는 상입니다." }
            ],

            // 4. 4대 영역별 상세 분석 리포트
            fortune: [
                { key: "성격", val: "자존심이 강하고 정의롭습니다. 겉으로는 차가워 보일 수 있으나, 내면은 누구보다 따뜻한 포용력을 지닌 '외유내강'형 리더입니다." },
                { key: "재물", val: "코의 발달 정도가 남달라 큰 자산가에게 나타나는 상입니다. 소소한 저축보다는 사업적 투자나 거대 자본을 굴리는 데 탁월한 소질이 있습니다." },
                { key: "연애/궁합", val: "눈가(어당/간문)가 깨끗하고 기운이 좋아 배우자의 덕을 입는 상입니다. 최고의 파트너는 온화한 기운의 [코끼리상]입니다." },
                { key: "직장/사회성", val: "이마의 관록궁이 빛나기 때문에 조직의 수장이나 독립적인 경영자로 대성합니다. 남의 밑에 있기보다는 길을 만드는 숙명을 가졌습니다." }
            ],

            // 5. 운을 바꾸는 처방전 (개운법)
            remedy: "기운이 너무 강해 주변 사람들이 위축될 수 있습니다. 눈매가 날카로울 때는 평소 입꼬리를 위로 올리는 '미소 근육'을 단련하여 인상을 부드럽게 하십시오. 인덕(人德)이 더해지면 천하가 당신의 발아래 놓일 것입니다."
        },
        {
            mainTitle: "지혜와 영리함으로 풍요를 일구는 지략가의 풍모 [여우상]",
            oneLine: "흐름을 읽고 실리를 챙기는 영리한 책사",
            summary: "빠른 상황 판단력과 유연한 처세술로 어떤 환경에서도 실리를 챙기는 지혜로운 관상입니다.",
            
            lifeCycle: [
                { stage: "초년운 (상정/0~30세)", desc: "미간(인당)이 깨끗하고 이마 측면이 발달했기 때문에, 지적인 호기심이 풍부하고 공부나 예능 방면에서 일찍이 두각을 나타냅니다." },
                { stage: "중년운 (중정/30~50세)", desc: "눈매가 가늘고 길어 통찰력이 비범하기 때문에, 복잡한 이해관계를 본인에게 유리하게 조율하며 사회적 성공의 발판을 완벽히 구축합니다." },
                { stage: "말년운 (하정/50세 이후)", desc: "입꼬리가 위를 향하고 하관이 부드럽기 때문에, 쌓아온 인맥과 재물을 바탕으로 품위 있고 여유로운 노후를 즐기게 됩니다." }
            ],

            parts: [
                { title: "눈 (정신/통찰)", desc: "눈빛이 반짝이고 예리하기 때문에, 상대의 의도를 단번에 간파하며 정보의 홍수 속에서 핵심을 짚어내는 재주가 탁월합니다." },
                { title: "눈썹 (재치/관계)", desc: "눈썹 모양이 가지런하고 수려하기 때문에, 대인관계가 원만하며 사람들의 마음을 얻어 본인의 뜻대로 움직이게 하는 힘이 있습니다." },
                { title: "코 (수완/재물)", desc: "코끝이 날카롭고 야무지게 맺혔기 때문에, 현실적인 감각이 매우 좋아 작은 기회도 실질적인 이익으로 연결하는 능력이 좋습니다." },
                { title: "입 (언변/신용)", desc: "입술이 도톰하고 선이 명확하기 때문에, 화술이 화려하며 논리적인 설득력으로 조직 내에서 브레인 역할을 수행합니다." },
                { title: "귀 (지혜/복)", desc: "귀 상단이 발달했기 때문에, 새로운 지식을 습득하는 속도가 빠르고 남들보다 앞서가는 안목을 가졌습니다." }
            ],

            fortune: [
                { key: "성격", val: "매우 섬세하고 상황 판단이 빠릅니다. 겉으로는 유쾌해 보이지만 내면에는 철저한 자기 관리와 전략적 사고가 자리 잡고 있습니다." },
                { key: "재물", val: "정보가 곧 돈이 되는 관상입니다. 재테크와 투자 감각이 뛰어나 자산을 꾸준히 증식시키며 마르지 않는 재물운을 자랑합니다." },
                { key: "연애/궁합", val: "매력이 넘쳐 이성에게 인기가 많습니다. 센스 있는 말솜씨로 화목한 가정을 꾸리며, 최고의 파트너는 우직한 [소상]입니다." },
                { key: "직장/성공", val: "마케팅, 전략 기획, 협상 전문가로 성공할 확률이 높습니다. 조직에서 대체 불가능한 핵심 인재로 인정받는 상입니다." }
            ],

            remedy: "지나치게 실속만 차리는 모습은 인덕을 해칠 수 있습니다. 미간을 활짝 펴는 습관을 들이고, 가끔은 타인을 위해 진심 어린 배려를 보이십시오. 당신의 지혜에 '진정성'이 더해질 때 운의 흐름은 더 큰 파도를 탈 것입니다."
        }
    ];

    const faceType = types[Math.floor(Math.random() * types.length)];

    return {
        mainTitle: faceType.mainTitle,
        oneLine: faceType.oneLine,
        summary: faceType.summary,
        lifeCycle: faceType.lifeCycle,
        parts: faceType.parts,
        fortune: faceType.fortune,
        remedy: faceType.remedy
    };
}

function displayResults(analysis, photoData) {
    // UI 업데이트 - 전문가 톤 리포트
    document.getElementById('face-type').innerText = analysis.mainTitle;
    document.getElementById('face-summary').innerText = `"${analysis.oneLine}"`;
    document.getElementById('result-photo').innerHTML = `<img src="${photoData}" class="w-full h-full object-cover">`;

    resultCards.innerHTML = '';

    // 1. 임팩트 있는 종합 총평
    resultCards.innerHTML += `
        <div class="result-card md:col-span-2 border-l-indigo-600 bg-white shadow-xl">
            <h4 class="text-indigo-700 font-extrabold text-xl mb-3"><i class="fas fa-crown mr-2"></i> AI 전문가 종합 판정</h4>
            <p class="text-gray-800 text-lg leading-relaxed font-medium">${analysis.summary}</p>
        </div>
    `;

    // 2. 인생 삼단계 대운 (Life Timeline)
    let lifeCycleHtml = '';
    analysis.lifeCycle.forEach(l => {
        lifeCycleHtml += `
            <div class="p-4 bg-white rounded-lg border-b last:border-0 hover:bg-orange-50 transition">
                <h5 class="font-bold text-orange-600 text-sm mb-1">● ${l.stage}</h5>
                <p class="text-gray-700 text-sm leading-relaxed">${l.desc}</p>
            </div>
        `;
    });
    resultCards.innerHTML += `
        <div class="result-card md:col-span-2 border-l-orange-500 bg-orange-50">
            <h4 class="text-orange-700 font-extrabold text-lg mb-3"><i class="fas fa-stream mr-2"></i> 인생 삼단계 대운 (Life Timeline)</h4>
            <div class="bg-white rounded-xl overflow-hidden divide-y divide-gray-100">${lifeCycleHtml}</div>
        </div>
    `;

    // 3. 5대 부위별 정밀 판독
    let partsHtml = '';
    analysis.parts.forEach(p => {
        partsHtml += `
            <div class="mb-5 last:mb-0">
                <h5 class="font-bold text-indigo-900 text-sm flex items-center">
                    <span class="w-1 h-3 bg-indigo-600 mr-2 rounded"></span>${p.title}
                </h5>
                <p class="text-gray-600 text-xs leading-relaxed pl-3 mt-1">${p.desc}</p>
            </div>
        `;
    });
    resultCards.innerHTML += `
        <div class="result-card md:col-span-1 border-l-indigo-600 bg-white">
            <h4 class="text-indigo-700 font-extrabold text-lg mb-4"><i class="fas fa-microscope mr-2"></i> 오관(五官) 정밀 판독</h4>
            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">${partsHtml}</div>
        </div>
    `;

    // 4. 4대 영역별 상세 분석 리포트
    let fortuneHtml = '';
    analysis.fortune.forEach(f => {
        fortuneHtml += `
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition">
                <p class="text-purple-600 font-bold text-xs mb-1 uppercase tracking-wider">${f.key} 진단</p>
                <p class="text-gray-800 text-sm leading-snug font-medium">${f.val}</p>
            </div>
        `;
    });
    resultCards.innerHTML += `
        <div class="result-card md:col-span-1 border-l-purple-600">
            <h4 class="text-purple-700 font-extrabold text-lg mb-4"><i class="fas fa-file-contract mr-2"></i> 영역별 심층 분석</h4>
            <div class="space-y-4">${fortuneHtml}</div>
        </div>
    `;

    // 5. 운을 바꾸는 처방전 (개운법)
    resultCards.innerHTML += `
        <div class="result-card md:col-span-2 border-l-emerald-600 bg-emerald-50 shadow-inner">
            <h4 class="text-emerald-700 font-extrabold text-lg mb-3"><i class="fas fa-magic mr-2"></i> 운명을 바꾸는 처방전 (개운법)</h4>
            <div class="p-4 bg-white rounded-xl border border-emerald-200">
                <p class="text-gray-800 text-sm leading-relaxed italic font-bold">
                    <i class="fas fa-lightbulb text-yellow-500 mr-1"></i> "${analysis.remedy}"
                </p>
            </div>
            <p class="text-xs text-emerald-600 mt-2 text-center">* 인상이 바뀌면 기운이 바뀌고, 기운이 바뀌면 운명이 바뀝니다.</p>
        </div>
    `;

    loading.classList.add('hidden');
    resultSection.classList.remove('hidden');
    window.scrollTo({ top: resultSection.offsetTop - 50, behavior: 'smooth' });
}
