# hakoiri-musume
I made a solver thing for a traditional japanese puzzle called "hakoiri-musume"  
プログラミング方法論の授業で出てきた箱入り娘ソルバー、気になったので実装してみました。  
[プログラミング方法論 文字列プログラミング](https://scrapbox.io/sfc-pm2021/4._%E6%96%87%E5%AD%97%E5%88%97%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0)  
[![箱入り娘](https://img.youtube.com/vi/azOaRBhernY/0.jpg)](https://www.youtube.com/watch?v=azOaRBhernY)  
2回移動無しで117ステップ、2回移動ありで91ステップです。  
授業で出てきた動画の解法は81ステップですが、これは斜めの動きも一ステップとしてカウントしているためで、このプログラムから出る解法もそのルールに従えば81ステップです(多分、数えるのめんどくさい)  
  
## 走らせよう！  
```bash
$ git clone git@github.com:martian17/hakoiri-musume.git
$ cd hakoiri-musume
$ node hakoiri.js
```
