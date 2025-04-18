---
title: 마크다운 스타일 테스트 문서1
author: Gano
categories: [Test, document]
tags: [jekyll]
---

이 문서는 마크다운 스타일이 올바르게 적용되는지 테스트하기 위한 예제입니다.

## 1. 텍스트 서식

일반 텍스트와 함께 **굵은 텍스트**, _기울임 텍스트_, **_굵고 기울임 텍스트_**, ~~취소선~~, `인라인 코드`를 사용할 수 있습니다.

링크도 테스트해봅시다: [GitHub](https://github.com)

## 2. 목록

### 순서 없는 목록

- 첫 번째 항목
- 두 번째 항목
  - 중첩된 항목
  - 또 다른 중첩된 항목
- 세 번째 항목

### 순서 있는 목록

1. 첫 번째 항목
2. 두 번째 항목
   1. 중첩된 항목
   2. 또 다른 중첩된 항목
3. 세 번째 항목

### 작업 목록

- [x] 완료된 작업
- [ ] 미완료된 작업
- [x] @mentions, #refs, [링크](https://naver.com), **서식**, ~~취소선~~ 지원
- [ ] 이 항목은 미완료 상태

## 3. 인용구

> 이것은 인용구입니다.
>
> 여러 단락을 가질 수 있습니다.
>
> > 중첩된 인용구도 가능합니다.

## 4. 코드 블록

### 언어 없는 코드 블록

```
function greeting() {
  console.log("Hello, World!");
}
```

### 언어 지정 코드 블록 (JavaScript)

```javascript
// 주석
function calculateSum(a, b) {
  const result = a + b; // 변수 선언
  return result;
}

// 클래스 예제
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `안녕하세요, ${this.name}님!`;
  }
}

// 비동기 함수
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('에러 발생:', error);
  }
}
```

### 다른 언어 (Python)

```python
# 파이썬 클래스 예제
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"안녕하세요, {self.name}님!"

# 리스트 컴프리헨션
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers if n % 2 == 0]
print(squares)  # [4, 16]
```

## 5. 표

| 이름   | 역할            | 기술 스택                   |
| ------ | --------------- | --------------------------- |
| 홍길동 | 프론트엔드 개발 | React, TypeScript, Tailwind |
| 김철수 | 백엔드 개발     | Node.js, Express, MongoDB   |
| 이영희 | 디자이너        | Figma, Photoshop            |

### 정렬된 표

| 왼쪽 정렬  | 가운데 정렬  | 오른쪽 정렬 |
| :--------- | :----------: | ----------: |
| 첫 번째 행 |    데이터    |        1234 |
| 두 번째 행 | 더 긴 데이터 |        5678 |
| 세 번째 행 | 짧은 데이터  |          90 |

## 6. 수평선

아래는 수평선입니다:

---

수평선 아래 내용입니다.

## 7. 이미지 참조 (실제 이미지는 없음)

![이미지 설명](https://example.com/image.jpg)

## 8. 정의 목록

<dl>
  <dt>마크다운</dt>
  <dd>텍스트 기반의 마크업 언어로, 웹에서 쉽게 읽고 쓸 수 있도록 디자인됨</dd>
  
  <dt>HTML</dt>
  <dd>웹 페이지의 구조를 정의하는 마크업 언어</dd>
  
  <dt>CSS</dt>
  <dd>웹 페이지의 디자인과 레이아웃을 지정하는 스타일 시트 언어</dd>
</dl>

## 9. 각주

여기 각주가 있습니다.[^1]

[^1]: 이것은 각주의 내용입니다.

## 10. 수학 표현식 (MathJax/KaTeX 지원이 필요함)

인라인 수식: $E = mc^2$

블록 수식:

$$
\frac{d}{dx}e^x = e^x
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
