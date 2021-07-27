const HmacSHA256 = require("crypto-js/hmac-sha256")
const SHA256 = require("crypto-js/sha256")
const fetch = require("node-fetch")
const jsbn = require("jsbn")
const rng = jsbn.SecureRandom.prototype
const BigInteger = jsbn.BigInteger
const getRandomValues = require("get-random-values")

const encDelimiter = ',';
const delimiter = '$';

const GenKey = function () {
    let g_tk_seed = "";
    let g_tk_seeded = 0;
    let g_tk_pool = 10325476;
    let g_tk_x = "";

    function S4() {
        let now = new Date();
        let seed = now.getSeconds();
        return tk_getrnd_hex(2)
    }

    this.GenerateKey = function (bit) {
        const cnt = bit / (8 * 4);
        let key = '';
        for (let i = 0; i < cnt; i++) {
            key += S4()
        }
        return key
    }
    ;
    this.tk_sh1prng = function () {
        return tk_sh1prng()
    }
    ;
    this.tk_getrnd_int = function () {
        return tk_getrnd_int()
    }
    ;

    function tk_entropy_pool(value) {
        g_tk_pool += value
    }

    function tk_get_entropy() {
        now = new Date();
        Xseed1 = now.getSeconds();
        Xseed2 = now.getMilliseconds();
        // var seed = Xseed2 + screen.height.toString() + screen.colorDepth.toString() + screen.availWidth.toString() + screen.availHeight.toString() + Xseed1.toString() + g_tk_pool + Xseed2.toString();
        const seed = Xseed2 + "1080" + "24" + "1920" + "1080" + Xseed1.toString() + g_tk_pool + Xseed2.toString();
        return seed
    }

    function tk_sh1prng() {
        now = new Date();
        if (!g_tk_seeded) {
            g_tk_seed = SHA256(tk_get_entropy());
            g_tk_seeded = 1
        }
        XSEEDj = now.getSeconds() + now.getMilliseconds();
        const xval = XSEEDj + g_tk_seed + g_tk_x + 1;
        g_tk_x = SHA256(xval).toString();
        return g_tk_x
    }

    function tk_getrnd_hex(length) {
        let rand = "";
        if (length < 20) {
            rand = tk_sh1prng();
            rand = rand.substring(0, length * 2);
            return rand
        } else {
            for (let i = 0; i < parseInt(length / 20); i++) {
                rand += tk_sh1prng()
            }
            if (length % 20) {
                rand_tmp = tk_sh1prng();
                rand += rand_tmp.substring(0, (length % 20) * 2)
            }
        }
        return rand
    }

    function tk_getrnd_int() {
        let rand;
        rand_int = 0;
        rand = tk_sh1prng();
        rand = rand.substring(0, 8);
        rand_int = parseInt(rand, 16);
        return rand_int
    }

    function tk_sha1(msg) {
        function rotate_left(n, s) {
            const t4 = (n << s) | (n >>> (32 - s));
            return t4
        }


        function lsb_hex(val) {
            let str = "";
            let i;
            let vh;
            let vl;
            for (i = 0; i <= 6; i += 2) {
                vh = (val >>> (i * 4 + 4)) & 0x0f;
                vl = (val >>> (i * 4)) & 0x0f;
                str += vh.toString(16) + vl.toString(16)
            }
            return str
        }


        function cvt_hex(val) {
            let str = "";
            let i;
            let v;
            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16)
            }
            return str
        }


        function Utf8Encode(string) {
            let utftext = "";
            for (let n = 0; n < string.length; n++) {
                const c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c)
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
            return utftext
        }

        let blockstart;
        var i, j;
        const W = new Array(80);
        let H0 = 0x67452301;
        let H1 = 0xEFCDAB89;
        let H2 = 0x98BADCFE;
        let H3 = 0x10325476;
        let H4 = 0xC3D2E1F0;
        let A, B, C, D, E;
        var temp;
        msg = Utf8Encode(msg);
        const msg_len = msg.length;
        const word_array = [];
        for (i = 0; i < msg_len - 3; i += 4) {
            j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
            word_array.push(j)
        }
        switch (msg_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
                break
        }
        word_array.push(i);
        while ((word_array.length % 16) !== 14)
            word_array.push(0);
        word_array.push(msg_len >>> 29);
        word_array.push((msg_len << 3) & 0x0ffffffff);
        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++)
                W[i] = word_array[blockstart + i];
            for (i = 16; i <= 79; i++)
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;
            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp
            }
            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp
            }
            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp
            }
            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp
            }
            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff
        }
        var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase()
    }
};

eval(function (p, a, c, k, e, r) {
    e = function (c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    }
    ;
    if (!''.replace(/^/, String)) {
        while (c--)
            r[e(c)] = k[c] || e(c);
        k = [function (e) {
            return r[e]
        }
        ];
        e = function () {
            return '\\w+'
        }
        ;
        c = 1
    }

    while (c--)
        if (k[c])
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('E 4k=2;E 2q=16;E 1n=2q;E 1f=1<<16;E 3l=1f>>>1;E 3m=1f*1f;E 1Y=1f-1;E 4l=4m;E 2S;E 2d;E 2r,1K;L 3n(3o){2S=3o;2d=M Y(2S);17(E 2s=0;2s<2d.W;2s++)2d[2s]=0;2r=M 18();1K=M 18();1K.I[0]=1}3n(20);E 2e=15;E 3p=2t(4n);L 18(2T){if(4o 2T=="4p"&&2T==1L){V.I=2u}1g{V.I=2d.3q(0)}V.N=2v}L 4q(s){E N=s.2w(0)==\'-\';E i=N?1:0;E G;1h(i<s.W&&s.2w(i)==\'0\')++i;if(i==s.W){G=M 18()}1g{E 1M=s.W-i;E 2f=1M%2e;if(2f==0)2f=2e;G=2t(1N(s.2U(i,2f)));i+=2f;1h(i<s.W){G=1Z(1O(G,3p),2t(1N(s.2U(i,2e))));i+=2e}G.N=N}T G}L 2x(bi){E G=M 18(1L);G.I=bi.I.3q(0);G.N=bi.N;T G}L 2t(i){E G=M 18();G.N=i<0;i=1j.4r(i);E j=0;1h(i>0){G.I[j++]=i&1Y;i=1j.2y(i/1f)}T G}L 2z(s){E G="";17(E i=s.W-1;i>-1;--i){G+=s.2w(i)}T G}E 2V=M Y(\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\',\'a\',\'b\',\'c\',\'d\',\'e\',\'f\',\'g\',\'h\',\'i\',\'j\',\'k\',\'l\',\'m\',\'n\',\'o\',\'p\',\'q\',\'r\',\'s\',\'t\',\'u\',\'v\',\'w\',\'x\',\'y\',\'z\');L 3r(x,1F){E b=M 18();b.I[0]=1F;E 1l=21(x,b);E G=2V[1l[1].I[0]];1h(27(1l[0],2r)==1){1l=21(1l[0],b);2W=1l[1].I[0];G+=2V[1l[1].I[0]]}T(x.N?"-":"")+2z(G)}L 4s(x){E b=M 18();b.I[0]=10;E 1l=21(x,b);E G=2A(1l[1].I[0]);1h(27(1l[0],2r)==1){1l=21(1l[0],b);G+=2A(1l[1].I[0])}T(x.N?"-":"")+2z(G)}E 3s=M Y(\'0\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\',\'7\',\'8\',\'9\',\'a\',\'b\',\'c\',\'d\',\'e\',\'f\');L 3t(n){E 3u=4t;E G="";17(i=0;i<4;++i){G+=3s[n&3u];n>>>=4}T 2z(G)}L 3v(x){E G="";17(E i=1o(x);i>-1;--i){G+=3t(x.I[i])}T G}L 2X(c){E 2B=48;E 3w=2B+9;E 2C=97;E 3x=2C+25;E 2Y=65;E 3y=65+25;E G;if(c>=2B&&c<=3w){G=c-2B}1g if(c>=2Y&&c<=3y){G=10+c-2Y}1g if(c>=2C&&c<=3x){G=10+c-2C}1g{G=0}T G}L 3z(s){E G=0;E 28=1j.1G(s.W,4);17(E i=0;i<28;++i){G<<=4;G|=2X(s.2D(i))}T G}L 2g(s){E G=M 18();E 28=s.W;17(E i=28,j=0;i>0;i-=4,++j){G.I[j]=3z(s.2U(1j.2h(i-4,0),1j.1G(i,4)))}T G}L 3A(s,1F){E N=s.2w(0)==\'-\';E 3B=N?1:0;E G=M 18();E 2i=M 18();2i.I[0]=1;17(E i=s.W-1;i>=3B;i--){E c=s.2D(i);E 2W=2X(c);E 3C=2E(2i,2W);G=1Z(G,3C);2i=2E(2i,1F)}G.N=N;T G}L 4u(b){T(b.N?"-":"")+b.I.4v(" ")}L 1Z(x,y){E G;if(x.N!=y.N){y.N=!y.N;G=1H(x,y);y.N=!y.N}1g{G=M 18();E c=0;E n;17(E i=0;i<x.I.W;++i){n=x.I[i]+y.I[i]+c;G.I[i]=n%1f;c=1N(n>=1f)}G.N=x.N}T G}L 1H(x,y){E G;if(x.N!=y.N){y.N=!y.N;G=1Z(x,y);y.N=!y.N}1g{G=M 18();E n,c;c=0;17(E i=0;i<x.I.W;++i){n=x.I[i]-y.I[i]+c;G.I[i]=n%1f;if(G.I[i]<0)G.I[i]+=1f;c=0-1N(n<0)}if(c==-1){c=0;17(E i=0;i<x.I.W;++i){n=0-G.I[i]+c;G.I[i]=n%1f;if(G.I[i]<0)G.I[i]+=1f;c=0-1N(n<0)}G.N=!x.N}1g{G.N=x.N}}T G}L 1o(x){E G=x.I.W-1;1h(G>0&&x.I[G]==0)--G;T G}L 2Z(x){E n=1o(x);E d=x.I[n];E m=(n+1)*1n;E G;17(G=m;G>m-1n;--G){if((d&3D)!=0)2F;d<<=1}T G}L 1O(x,y){E G=M 18();E c;E n=1o(x);E t=1o(y);E 1P,k;17(E i=0;i<=t;++i){c=0;k=i;17(j=0;j<=n;++j,++k){1P=G.I[k]+x.I[j]*y.I[i]+c;G.I[k]=1P&1Y;c=1P>>>2q}G.I[i+n+1]=c}G.N=x.N!=y.N;T G}L 2E(x,y){E n,c,1P;G=M 18();n=1o(x);c=0;17(E j=0;j<=n;++j){1P=G.I[j]+x.I[j]*y+c;G.I[j]=1P&1Y;c=1P>>>2q}G.I[1+n]=c;T G}L 29(30,32,3E,3F,n){E m=1j.1G(32+n,30.W);17(E i=32,j=3F;i<m;++i,++j){3E[j]=30[i]}}E 3G=M Y(3H,3D,4w,4x,4y,4z,4A,4B,4C,4D,4E,4F,4G,4H,4I,4J,3I);L 33(x,n){E 1M=1j.2y(n/1n);E G=M 18();29(x.I,0,G.I,1M,G.I.W-1M);E 1t=n%1n;E 3J=1n-1t;17(E i=G.I.W-1,i1=i-1;i>0;--i,--i1){G.I[i]=((G.I[i]<<1t)&1Y)|((G.I[i1]&3G[1t])>>>(3J))}G.I[0]=((G.I[i]<<1t)&1Y);G.N=x.N;T G}E 3K=M Y(3H,4K,4L,4M,4N,4O,4P,4Q,4R,4S,4T,4U,4V,4W,4X,4Y,3I);L 2j(x,n){E 1M=1j.2y(n/1n);E G=M 18();29(x.I,1M,G.I,0,x.I.W-1M);E 1t=n%1n;E 3L=1n-1t;17(E i=0,i1=i+1;i<G.I.W-1;++i,++i1){G.I[i]=(G.I[i]>>>1t)|((G.I[i1]&3K[1t])<<3L)}G.I[G.I.W-1]>>>=1t;G.N=x.N;T G}L 34(x,n){E G=M 18();29(x.I,0,G.I,n,G.I.W-n);T G}L 35(x,n){E G=M 18();29(x.I,n,G.I,0,G.I.W-n);T G}L 36(x,n){E G=M 18();29(x.I,0,G.I,0,n);T G}L 27(x,y){if(x.N!=y.N){T 1-2*1N(x.N)}17(E i=x.I.W-1;i>=0;--i){if(x.I[i]!=y.I[i]){if(x.N){T 1-2*1N(x.I[i]>y.I[i])}1g{T 1-2*1N(x.I[i]<y.I[i])}}}T 0}L 21(x,y){E 2G=2Z(x);E 2k=2Z(y);E 2H=y.N;E q,r;if(2G<2k){if(x.N){q=2x(1K);q.N=!y.N;x.N=2v;y.N=2v;r=1H(y,x);x.N=1L;y.N=2H}1g{q=M 18();r=2x(x)}T M Y(q,r)}q=M 18();r=x;E t=1j.2I(2k/1n)-1;E 2a=0;1h(y.I[t]<3l){y=33(y,1);++2a;++2k;t=1j.2I(2k/1n)-1}r=33(r,2a);2G+=2a;E n=1j.2I(2G/1n)-1;E b=34(y,n-t);1h(27(r,b)!=-1){++q.I[n-t];r=1H(r,b)}17(E i=n;i>t;--i){E 2l=(i>=r.I.W)?0:r.I[i];E 2J=(i-1>=r.I.W)?0:r.I[i-1];E 37=(i-2>=r.I.W)?0:r.I[i-2];E 2m=(t>=y.I.W)?0:y.I[t];E 38=(t-1>=y.I.W)?0:y.I[t-1];if(2l==2m){q.I[i-t-1]=1Y}1g{q.I[i-t-1]=1j.2y((2l*1f+2J)/2m)}E c1=q.I[i-t-1]*((2m*1f)+38);E c2=(2l*3m)+((2J*1f)+37);1h(c1>c2){--q.I[i-t-1];c1=q.I[i-t-1]*((2m*1f)|38);c2=(2l*1f*1f)+((2J*1f)+37)}b=34(y,i-t-1);r=1H(r,2E(b,q.I[i-t-1]));if(r.N){r=1Z(r,b);--q.I[i-t-1]}}r=2j(r,2a);q.N=x.N!=2H;if(x.N){if(2H){q=1Z(q,1K)}1g{q=1H(q,1K)}y=2j(y,2a);r=1H(y,r)}if(r.I[0]==0&&1o(r)==0)r.N=2v;T M Y(q,r)}L 3M(x,y){T 21(x,y)[0]}L 3N(x,y){T 21(x,y)[1]}L 39(x,y,m){T 3N(1O(x,y),m)}L 4Z(x,y){E G=1K;E a=x;1h(1L){if((y&1)!=0)G=1O(G,a);y>>=1;if(y==0)2F;a=1O(a,a)}T G}L 50(x,y,m){E G=1K;E a=x;E k=y;1h(1L){if((k.I[0]&1)!=0)G=39(G,a,m);k=2j(k,1);if(k.I[0]==0&&1o(k)==0)2F;a=39(a,a,m)}T G}L 3O(m){V.1I=2x(m);V.k=1o(V.1I)+1;E 3a=M 18();3a.I[2*V.k]=1;V.mu=3M(3a,V.1I);V.3b=M 18();V.3b.I[V.k+1]=1;V.3P=3Q;V.3c=3R;V.3d=3S}L 3Q(x){E 3T=35(x,V.k-1);E 3U=1O(3T,V.mu);E 3V=35(3U,V.k+1);E 3W=36(x,V.k+1);E 3X=1O(3V,V.1I);E 3Y=36(3X,V.k+1);E r=1H(3W,3Y);if(r.N){r=1Z(r,V.3b)}E 3e=27(r,V.1I)>=0;1h(3e){r=1H(r,V.1I);3e=27(r,V.1I)>=0}T r}L 3R(x,y){E 3Z=1O(x,y);T V.3P(3Z)}L 3S(x,y){E G=M 18();G.I[0]=1;E a=x;E k=y;1h(1L){if((k.I[0]&1)!=0)G=V.3c(G,a);k=2j(k,1);if(k.I[0]==0&&1o(k)==0)2F;a=V.3c(a,a)}T G}L 51(40,41,1I){V.e=2g(40);V.d=2g(41);V.m=2g(1I);V.2K=2*1o(V.m);V.1F=16;V.3f=M 3O(V.m)}L 52(n){T(n<10?"0":"")+2A(n)}L 53(1k,s){E a=M Y();E 28=s.W;E i=0;1h(i<28){a[i]=s.2D(i);i++}1h(a.W%1k.2K!=0){a[i++]=0}E al=a.W;E G="";E j,k,1u;17(i=0;i<al;i+=1k.2K){1u=M 18();j=0;17(k=i;k<i+1k.2K;++j){1u.I[j]=a[k++];1u.I[j]+=a[k++]<<8}E 3g=1k.3f.3d(1u,1k.e);E 42=1k.1F==16?3v(3g):3r(3g,1k.1F);G+=42+" "}T G.43(0,G.W-1)}L 54(1k,s){E 2L=s.55(" ");E G="";E i,j,1u;17(i=0;i<2L.W;++i){E bi;if(1k.1F==16){bi=2g(2L[i])}1g{bi=3A(2L[i],1k.1F)}1u=1k.3f.3d(bi,1k.d);17(j=0;j<=1o(1u);++j){G+=2A.56(1u.I[j]&57,1u.I[j]>>8)}}if(G.2D(G.W-1)==0){G=G.43(0,G.W-1)}T G}E F={};E 22=1;F.1v=L(A){T(S&(A))};F.1w=L(A){T(S&((A)>>>8))};F.1x=L(A){T(S&((A)>>>16))};F.1y=L(A){T(S&((A)>>>24))};F.58=L(44){22=44};F.1b=L(1p){1p[0]=(1p[0]>>>24)|(1p[0]<<24)|((1p[0]<<8)&45)|((1p[0]>>>8)&46)};F.1b=L(1p){T(1p>>>24)|(1p<<24)|((1p<<8)&45)|((1p>>>8)&46)};F.X=L(O,P,Q,R,K){E 1c,1d;E 19=0,1a=0;1c=Q[0]^K[0];1d=R[0]^K[1];1d^=1c;19=(1c<0)?(1c&2M)|(2N):(1c);1d=F.1z[F.1v(1d)]^F.1A[F.1w(1d)]^F.1B[F.1x(1d)]^F.1C[F.1y(1d)];1a=(1d<0)?(1d&2M)|(2N):(1d);19+=1a;1c=F.1z[F.1v(19)]^F.1A[F.1w(19)]^F.1B[F.1x(19)]^F.1C[F.1y(19)];19=(1c<0)?(1c&2M)|(2N):(1c);1a+=19;1d=F.1z[F.1v(1a)]^F.1A[F.1w(1a)]^F.1B[F.1x(1a)]^F.1C[F.1y(1a)];1a=(1d<0)?(1d&2M)|(2N):(1d);19+=1a;O[0]^=19;P[0]^=1a};F.47=L(U,H,1e){E O=M Y(1);E P=M Y(1);E Q=M Y(1);E R=M Y(1);O[0]=1Q;P[0]=1Q;Q[0]=1Q;R[0]=1Q;E K=M Y(2);E J=0;O[0]=(U[0]&S);O[0]=((O[0])<<8)^(U[1]&S);O[0]=((O[0])<<8)^(U[2]&S);O[0]=((O[0])<<8)^(U[3]&S);P[0]=(U[4]&S);P[0]=((P[0])<<8)^(U[5]&S);P[0]=((P[0])<<8)^(U[6]&S);P[0]=((P[0])<<8)^(U[7]&S);Q[0]=(U[8]&S);Q[0]=((Q[0])<<8)^(U[9]&S);Q[0]=((Q[0])<<8)^(U[10]&S);Q[0]=((Q[0])<<8)^(U[11]&S);R[0]=(U[12]&S);R[0]=((R[0])<<8)^(U[13]&S);R[0]=((R[0])<<8)^(U[14]&S);R[0]=((R[0])<<8)^(U[15]&S);if(!22){1b(O);1b(P);1b(Q);1b(R)}K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);K[0]=H[J++];K[1]=H[J++];F.X(O,P,Q,R,K);K[0]=H[J++];K[1]=H[J++];F.X(Q,R,O,P,K);if(!22){1b(O);1b(P);1b(Q);1b(R)}17(E i=0;i<4;i++){1e[i]=(((Q[0])>>>(8*(3-i)))&1R);1e[4+i]=(((R[0])>>>(8*(3-i)))&1R);1e[8+i]=(((O[0])>>>(8*(3-i)))&1R);1e[12+i]=(((P[0])>>>(8*(3-i)))&1R)}};F.49=L(U,H,1e){E O=M Y(1);E P=M Y(1);E Q=M Y(1);E R=M Y(1);E K=M Y(2);O[0]=1Q;P[0]=1Q;Q[0]=1Q;R[0]=1Q;E J=31;O[0]=(U[0]&S);O[0]=((O[0])<<8)^(U[1]&S);O[0]=((O[0])<<8)^(U[2]&S);O[0]=((O[0])<<8)^(U[3]&S);P[0]=(U[4]&S);P[0]=((P[0])<<8)^(U[5]&S);P[0]=((P[0])<<8)^(U[6]&S);P[0]=((P[0])<<8)^(U[7]&S);Q[0]=(U[8]&S);Q[0]=((Q[0])<<8)^(U[9]&S);Q[0]=((Q[0])<<8)^(U[10]&S);Q[0]=((Q[0])<<8)^(U[11]&S);R[0]=(U[12]&S);R[0]=((R[0])<<8)^(U[13]&S);R[0]=((R[0])<<8)^(U[14]&S);R[0]=((R[0])<<8)^(U[15]&S);if(!22){1b(O);1b(P);1b(Q);1b(R)}K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J--];F.X(Q,R,O,P,K);K[1]=H[J--];K[0]=H[J--];F.X(O,P,Q,R,K);K[1]=H[J--];K[0]=H[J];F.X(Q,R,O,P,K);if(!22){1b(O);1b(P);1b(Q);1b(R)}17(E i=0;i<4;i++){1e[i]=(((Q[0])>>>(8*(3-i)))&1R);1e[4+i]=(((R[0])>>>(8*(3-i)))&1R);1e[8+i]=(((O[0])>>>(8*(3-i)))&1R);1e[12+i]=(((P[0])>>>(8*(3-i)))&1R)}};F.1J=L(K,A,B,C,D,Z){E 1c;E 19,1a;1c=A[0];A[0]=(A[0]>>>8)^(B[0]<<24);B[0]=(B[0]>>>8)^(1c<<24);19=A[0]+C[0]-F.23[Z];1a=B[0]+F.23[Z]-D[0];K[0]=F.1z[F.1v(19)]^F.1A[F.1w(19)]^F.1B[F.1x(19)]^F.1C[F.1y(19)];K[1]=F.1z[F.1v(1a)]^F.1A[F.1w(1a)]^F.1B[F.1x(1a)]^F.1C[F.1y(1a)]};F.1S=L(K,A,B,C,D,Z){E 1c;E 19,1a;1c=C[0];C[0]=(C[0]<<8)^(D[0]>>>24);D[0]=(D[0]<<8)^(1c>>>24);19=A[0]+C[0]-F.23[Z];1a=B[0]+F.23[Z]-D[0];K[0]=F.1z[F.1v(19)]^F.1A[F.1w(19)]^F.1B[F.1x(19)]^F.1C[F.1y(19)];K[1]=F.1z[F.1v(1a)]^F.1A[F.1w(1a)]^F.1B[F.1x(1a)]^F.1C[F.1y(1a)]};F.4a=L(H,1i){E A=M Y(1);E B=M Y(1);E C=M Y(1);E D=M Y(1);E K=M Y(2);E 1c,1d;E J=2;A[0]=(1i[0]&S);A[0]=(A[0]<<8)^(1i[1]&S);A[0]=(A[0]<<8)^(1i[2]&S);A[0]=(A[0]<<8)^(1i[3]&S);B[0]=(1i[4]&S);B[0]=(B[0]<<8)^(1i[5]&S);B[0]=(B[0]<<8)^(1i[6]&S);B[0]=(B[0]<<8)^(1i[7]&S);C[0]=(1i[8]&S);C[0]=(C[0]<<8)^(1i[9]&S);C[0]=(C[0]<<8)^(1i[10]&S);C[0]=(C[0]<<8)^(1i[11]&S);D[0]=(1i[12]&S);D[0]=(D[0]<<8)^(1i[13]&S);D[0]=(D[0]<<8)^(1i[14]&S);D[0]=(D[0]<<8)^(1i[15]&S);if(!22){A[0]=1b(A[0]);B[0]=1b(B[0]);C[0]=1b(C[0]);D[0]=1b(D[0])}1c=A[0]+C[0]-F.23[0];1d=B[0]-D[0]+F.23[0];H[0]=F.1z[F.1v(1c)]^F.1A[F.1w(1c)]^F.1B[F.1x(1c)]^F.1C[F.1y(1c)];H[1]=F.1z[F.1v(1d)]^F.1A[F.1w(1d)]^F.1B[F.1x(1d)]^F.1C[F.1y(1d)];F.1J(K,A,B,C,D,1);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,2);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,3);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,4);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,5);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,6);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,7);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,8);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,9);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,10);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,11);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,12);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,13);H[J++]=K[0];H[J++]=K[1];F.1S(K,A,B,C,D,14);H[J++]=K[0];H[J++]=K[1];F.1J(K,A,B,C,D,15);H[J++]=K[0];H[J++]=K[1]};F.3h=L(1e,4b,4c){E i=0;17(i=0;i<16;i++){1e[i]=(4b[i]^4c[i])}};F.59=L(H,1k){F.4a(H,1k)};F.1m=L(4d,3i,4e,4f,1T){17(E i=3i;i<(3i+1T);i++){4e[4f++]=4d[i]}};F.4g=L(1e,U,H){F.47(U,H,1e)};F.4h=L(1e,U,H){F.49(U,H,1e)};F.5a=L(H,iv,U,1T,1e){E i,1D,1q;1D=1T/16;1q=1T%16;E 1U=M Y(1D*16+1q);E 1r=M Y(16);E 26=M Y(16);E 1V=M Y(16);F.1m(iv,0,1V,0,16);17(i=0;i<1D;i++){F.1m(U,i*16,26,0,16);F.3h(1r,26,1V);F.4g(1r,1r,H);F.1m(1r,0,1U,i*16,16);F.1m(1r,0,1V,0,16)}if(1q!=0){F.1m(U,i*16,1U,i*16,1q)}F.1m(1U,0,1e,0,1D*16+1q)};F.5b=L(H,iv,U,1T,1e){E i,1D,1q;1D=1T/16;1q=1T%16;E 1U=M Y(16*1D);E 1r=M Y(16);E 26=M Y(16);E 1V=M Y(16);F.1m(iv,0,1V,0,16);17(i=0;i<1D;i++){F.1m(U,i*16,26,0,16);F.4h(1r,26,H);F.3h(1r,1r,1V);F.1m(1r,0,1U,i*16,16);F.1m(26,0,1V,0,16)}if(1q!=0){F.1m(U,i*16,1U,i*16,1q)}F.1m(1U,0,1e,0,1D*16+1q)};F.1z=[5c,5d,5e,5f,5g,5h,5i,5j,5k,5l,5m,5n,5o,5p,5q,5r,5s,5t,5u,5v,5w,5x,5y,5z,5A,5B,5C,5D,5E,5F,5G,5H,5I,5J,5K,5L,5M,5N,5O,5P,5Q,5R,5S,5T,5U,5V,5W,5X,5Y,5Z,60,61,62,63,64,66,67,68,69,6a,6b,6c,6d,6e,6f,6g,6h,6i,6j,6k,6l,6m,6n,6o,6p,6q,6r,6s,6t,6u,6v,6w,6x,6y,6z,6A,6B,6C,6D,6E,2O,6F,6G,6H,6I,6J,6K,6L,6M,6N,6O,6P,6Q,6R,6S,6T,6U,6V,6W,6X,6Y,6Z,70,71,72,73,74,75,76,77,78,79,7a,7b,7c,7d,7e,7f,7g,7h,7i,7j,7k,7l,7m,7n,7o,7p,7q,7r,7s,7t,7u,7v,7w,7x,7y,7z,7A,7B,7C,7D,7E,7F,7G,7H,7I,7J,7K,7L,7M,7N,7O,7P,7Q,7R,7S,7T,7U,7V,7W,7X,7Y,7Z,80,81,82,83,84,85,86,87,88,89,8a,8b,8c,8d,8e,8f,8g,8h,8i,8j,8k,8l,8m,8n,8o,8p,8q,8r,8s,8t,8u,8v,8w,8x,8y,8z,8A,8B,8C,8D,8E,8F,8G,8H,8I,8J,8K,8L,8M,8N,8O,8P,8Q,8R,8S,8T,8U,8V,8W,8X,8Y,8Z,90,91,92,93,94,95,96,98,99,9a,9b,9c,9d,9e,9f,9g,9h,9i,9j,9k];F.1A=[9l,9m,9n,9o,9p,9q,9r,9s,9t,9u,9v,9w,9x,9y,9z,9A,9B,9C,9D,9E,9F,9G,9H,9I,9J,9K,9L,9M,9N,9O,9P,9Q,9R,9S,9T,9U,9V,9W,9X,9Y,9Z,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,am,an,ao,ap,aq,as,at,au,av,aw,ax,ay,az,aA,aB,aC,aD,aE,aF,aG,aH,aI,aJ,aK,aL,aM,aN,aO,aP,aQ,aR,aS,aT,aU,aV,aW,aX,aY,aZ,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,ba,bb,bc,bd,bf,bg,bh,bj,bk,bl,bm,bn,bo,bp,bq,br,bs,bt,bu,bv,bw,bx,by,bz,bA,bB,bC,bD,bE,bF,bG,bH,bI,bJ,bK,bL,bM,bN,bO,bP,bQ,bR,bS,bT,bU,bV,bW,bX,bY,bZ,c0,c3,c4,c5,c6,c7,c8,c9,ca,cb,cc,cd,ce,cf,cg,ch,ci,cj,ck,cl,cm,cn,co,cp,cq,cr,cs,ct,cu,cv,cw,cx,cy,cz,cA,cB,cC,cD,cE,cF,cG,cH,cI,cJ,cK,cL,cM,cN,cO,cP,cQ,cR,cS,2O,cT,cU,cV,cW,cX,cY,cZ,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,da,db,dc,dd,de,df,dg,dh,di,dj,dk,dl,dm,dn,do,dp,dq,dr,ds,dt,du,dv,dw,dx];F.1B=[dy,dz,dA,dB,dC,dD,dE,dF,dG,dH,dI,dJ,dK,dL,dM,dN,dO,dP,dQ,dR,dS,dT,dU,dV,dW,dX,dY,dZ,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,ea,eb,ec,ed,ee,ef,eg,eh,ei,ej,ek,el,em,en,eo,ep,eq,er,es,et,eu,ev,ew,ex,ey,ez,eA,eB,eC,eD,eE,eF,eG,eH,eI,eJ,eK,eL,eM,eN,eO,eP,eQ,eR,eS,eT,eU,eV,eW,eX,eY,eZ,2O,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,fa,fb,fc,fd,fe,ff,fg,fh,fi,fj,fk,fl,fm,fn,fo,fp,fq,fr,fs,ft,fu,fv,fw,fx,fy,fz,fA,fB,fC,fD,fE,fF,fG,fH,fI,fJ,fK,fL,fM,fN,fO,fP,fQ,fR,fS,fT,fU,fV,fW,fX,fY,fZ,g0,g1,g2,g3,g4,g5,g6,g7,g8,g9,ga,gb,gc,gd,ge,gf,gg,gh,gi,gj,gk,gl,gm,gn,go,gp,gq,gr,gs,gt,gu,gv,gw,gx,gy,gz,gA,gB,gC,gD,gE,gF,gG,gH,gI,gJ,gK,gL,gM,gN,gO,gP,gQ,gR,gS,gT,gU,gV,gW,gX,gY,gZ,h0,h1,h2,h3,h4,h5,h6,h7,h8,h9,ha,hb,hc,hd,he,hf,hg,hh,hi,hj,hk,hl,hm,hn,ho,hp,hq,hr,hs,ht,hu,hv,hw,hx,hy,hz,hA,hB,hC,hD,hE];F.1C=[hF,hG,hH,hI,hJ,hK,hL,hM,hN,hO,hP,hQ,hR,hS,hT,hU,hV,hW,hX,hY,hZ,i0,i2,i3,i4,i5,i6,i7,i8,i9,ia,ib,ic,id,ie,ig,ih,ii,ij,ik,il,im,in,io,ip,iq,ir,is,it,iu,iw,ix,iy,iz,iA,iB,iC,iD,iE,iF,iG,iH,iI,iJ,iK,iL,iM,iN,iO,iP,iQ,iR,iS,iT,iU,iV,iW,iX,iY,iZ,j0,j1,j2,j3,j4,j5,j6,j7,j8,j9,ja,jb,jc,jd,je,jf,jg,jh,ji,jj,jk,jl,jm,jn,jo,jp,jq,jr,js,jt,ju,jv,jw,jx,jy,jz,jA,jB,jC,jD,jE,jF,jG,jH,jI,jJ,jK,jL,jM,jN,jO,jP,jQ,jR,jS,jT,jU,jV,jW,jX,jY,jZ,k0,k1,k2,k3,k4,k5,k6,k7,k8,k9,ka,kb,kc,kd,ke,kf,kg,kh,ki,kj,kk,kl,km,kn,ko,kp,kq,kr,ks,kt,ku,kv,kw,kx,ky,kz,kA,kB,kC,kD,kE,kF,kG,kH,kI,kJ,kK,kL,kM,kN,kO,kP,kQ,kR,kS,kT,kU,kV,kW,kX,kY,kZ,l0,l1,l2,l3,l4,l5,l6,l7,l8,l9,2O,la,lb,lc,ld,le,lf,lg,lh,li,lj,lk,ll,lm,ln,lo,lp,lq,lr,ls,lt,lu,lv,lw,lx,ly,lz,lA,lB,lC,lD,lE,lF,lG,lH,lI,lJ,lK,lL,lM,lN,lO];F.23=[lP,lQ,lR,lS,lT,lU,lV,lW,lX,lY,lZ,m0,m1,m2,m3,m4];E m5={m6:L(1G,2h,1s,1E){E 1W;if(1s==2u){if(1E==2u){1E=m7}if(1E.3j==\'m8\'||1E.2P.2Q("m9")>0||1E.2P.2Q("ma")>0||1E.2P.2Q("mb")>0){1s=1}1g{if(1E.3j=="mc md me")1s=3;1g if(1E.3j=="mf"&&1E.2P.mg().2Q(\'mh\')!=-1)1s=2}}if(1s!=2u){if(1s==1||1s==2){1W=2h-1G;if(1W<=0){mi M mj(\'2h mk be ml mm 1G\');}E 2n=1j.2I(1j.mn(1W)/8);if(!2n){T 1G}E 3k=1j.mo(mp,2n);E ar=M mq(2n);1h(1L){if(1s==1){1X.mr.4i(ar)}1g if(1s==2){1X.ms.4i(ar)}E 2o=0;17(E i=0;i<2n;i++){2o=(2o<<8)+ar[i]}if(2o<3k-3k%1W){T 1G+(2o%1W)}}}1g if(1s==3){E 2R;1h(1L){mt{1W=2h;if(!1X[\'2b\'])1X[\'2b\']=mv;if(!1X[\'2c\'])1X[\'2c\']=mw;if(!1X[\'2p\'])1X[\'2p\']=mx;2c=(my*(2c&4j)+(2c>>16))&2p;2b=(mz*(2b&4j)+(2b>>16))&2p;E G=((2c<<16)+2b)&2p;G/=mA;2R=mB((G+0.5)*1W);if(2R>=1G)T 2R}mC(e){T\'\'}}}}}};', 62, 1403, '||||||||||||||||||||||||||||||||||||||||var|Seed|result|roundKey|digits|nCount||function|new|isNeg|L0|L1|R0|R1|0x000000ff|return|inData|this|length|SeedRound|Array|||||||||for|BigInt|T00|T11|EndianChange|T0|T1|outData|biRadix|else|while|userKey|Math|key|qr|ArrayCopy|bitsPerDigit|biHighIndex|dws|remainLen|resultIn|browser|bits|block|GetB0|GetB1|GetB2|GetB3|SS0|SS1|SS2|SS3|blockSize|navi|radix|min|biSubtract|modulus|EncRoundKeyUpdate0|bigOne|true|digitCount|Number|biMultiply|uv|0x0|0xff|EncRoundKeyUpdate1|len|resultOut|xorer|range|window|maxDigitVal|biAdd||biDivideModulo|ENDIAN|KC|||Input|biCompare|sl|arrayCopy|lambda|_ex_m_w|_ex_m_z|ZERO_ARRAY|dpl10|fgl|biFromHex|max|place|biShiftRight|tb|ri|yt|requestBytes|val|_ex_mask|biRadixBits|bigZero|iza|biFromNumber|null|false|charAt|biCopy|floor|reverseStr|String|ZERO|littleA|charCodeAt|biMultiplyDigit|break|nb|origYIsNeg|ceil|ri1|chunkSize|blocks|0x7fffffff|0x80000000|0x00000000|userAgent|indexOf|num|maxDigits|flag|substr|hexatrigesimalToChar|digit|charToHex|bigA|biNumBits|src||srcStart|biShiftLeft|biMultiplyByRadixPower|biDivideByRadixPower|biModuloByRadixPower|ri2|yt1|biMultiplyMod|b2k|bkplus1|multiplyMod|powMod|rgtem|barrett|crypt|SeedXor|srcPos|appName|maxNum|biHalfRadix|biRadixSquared|setMaxDigits|value|lr10|slice|biToString|hexToChar|digitToHex|mask|biToHex|NINE|littleZ|bigZ|hexToDigit|biFromString|istop|biDigit|0x8000|dest|destStart|highBitMasks|0x0000|0xFFFF|rightBits|lowBitMasks|leftBits|biDivide|biModulo|BarrettMu|modulo|BarrettMu_modulo|BarrettMu_multiplyMod|BarrettMu_powMod|q1|q2|q3|r1|r2term|r2|xy|encryptionExponent|decryptionExponent|text|substring|edn|0x00ff0000|0x0000ff00|SeedEncrypt||SeedDecrypt|SeedRoundKey|inData1|inData2|srcData|destData|destPos|SeedEncryptEcb|SeedDecryptEcb|getRandomValues|65535|biRadixBase|maxInteger|9999999999999998|1000000000000000|typeof|boolean|biFromDecimal|abs|biToDecimal|0xf|biDump|join|0xC000|0xE000|0xF000|0xF800|0xFC00|0xFE00|0xFF00|0xFF80|0xFFC0|0xFFE0|0xFFF0|0xFFF8|0xFFFC|0xFFFE|0x0001|0x0003|0x0007|0x000F|0x001F|0x003F|0x007F|0x00FF|0x01FF|0x03FF|0x07FF|0x0FFF|0x1FFF|0x3FFF|0x7FFF|biPow|biPowMod|RSAKeyPair|twoDigit|encryptedString|decryptedString|split|fromCharCode|255|Endian|SeedSetKey|SeedEncryptCbc|SeedDecryptCbc|0x2989a1a8|0x05858184|0x16c6d2d4|0x13c3d3d0|0x14445054|0x1d0d111c|0x2c8ca0ac|0x25052124|0x1d4d515c|0x03434340|0x18081018|0x1e0e121c|0x11415150|0x3cccf0fc|0x0acac2c8|0x23436360|0x28082028|0x04444044|0x20002020|0x1d8d919c|0x20c0e0e0|0x22c2e2e0|0x08c8c0c8|0x17071314|0x2585a1a4|0x0f8f838c|0x03030300|0x3b4b7378|0x3b8bb3b8|0x13031310|0x12c2d2d0|0x2ecee2ec|0x30407070|0x0c8c808c|0x3f0f333c|0x2888a0a8|0x32023230|0x1dcdd1dc|0x36c6f2f4|0x34447074|0x2ccce0ec|0x15859194|0x0b0b0308|0x17475354|0x1c4c505c|0x1b4b5358|0x3d8db1bc|0x01010100|0x24042024|0x1c0c101c|0x33437370|0x18889098|0x10001010|0x0cccc0cc|0x32c2f2f0||0x19c9d1d8|0x2c0c202c|0x27c7e3e4|0x32427270|0x03838380|0x1b8b9398|0x11c1d1d0|0x06868284|0x09c9c1c8|0x20406060|0x10405050|0x2383a3a0|0x2bcbe3e8|0x0d0d010c|0x3686b2b4|0x1e8e929c|0x0f4f434c|0x3787b3b4|0x1a4a5258|0x06c6c2c4|0x38487078|0x2686a2a4|0x12021210|0x2f8fa3ac|0x15c5d1d4|0x21416160|0x03c3c3c0|0x3484b0b4|0x01414140|0x12425250|0x3d4d717c|0x0d8d818c|0x08080008|0x1f0f131c|0x19899198|0x19091118|0x04040004|0x13435350|0x37c7f3f4|0x21c1e1e0|0x3dcdf1fc|0x36467274|0x2f0f232c|0x27072324|0x3080b0b0|0x0b8b8388|0x0e0e020c|0x2b8ba3a8|0x2282a2a0|0x2e4e626c|0x13839390|0x0d4d414c|0x29496168|0x3c4c707c|0x09090108|0x0a0a0208|0x3f8fb3bc|0x2fcfe3ec|0x33c3f3f0|0x05c5c1c4|0x07878384|0x14041014|0x3ecef2fc|0x24446064|0x1eced2dc|0x2e0e222c|0x0b4b4348|0x1a0a1218|0x06060204|0x21012120|0x2b4b6368|0x26466264|0x02020200|0x35c5f1f4|0x12829290|0x0a8a8288|0x0c0c000c|0x3383b3b0|0x3e4e727c|0x10c0d0d0|0x3a4a7278|0x07474344|0x16869294|0x25c5e1e4|0x26062224|0x00808080|0x2d8da1ac|0x1fcfd3dc|0x2181a1a0|0x30003030|0x37073334|0x2e8ea2ac|0x36063234|0x15051114|0x22022220|0x38083038|0x34c4f0f4|0x2787a3a4|0x05454144|0x0c4c404c|0x01818180|0x29c9e1e8|0x04848084|0x17879394|0x35053134|0x0bcbc3c8|0x0ecec2cc|0x3c0c303c|0x31417170|0x11011110|0x07c7c3c4|0x09898188|0x35457174|0x3bcbf3f8|0x1acad2d8|0x38c8f0f8|0x14849094|0x19495158|0x02828280|0x04c4c0c4|0x3fcff3fc|0x09494148|0x39093138|0x27476364|0x00c0c0c0|0x0fcfc3cc|0x17c7d3d4|0x3888b0b8|0x0f0f030c|0x0e8e828c|0x02424240|0x23032320|0x11819190|0x2c4c606c|0x1bcbd3d8|0x2484a0a4|0x34043034|0x31c1f1f0|0x08484048|0x02c2c2c0|0x2f4f636c|0x3d0d313c|0x2d0d212c|0x00404040|0x3e8eb2bc|0x3e0e323c|0x3c8cb0bc|0x01c1c1c0|0x2a8aa2a8|0x3a8ab2b8|0x0e4e424c|0x15455154|0x3b0b3338|0x1cccd0dc|0x28486068|0x3f4f737c|0x1c8c909c|0x18c8d0d8|0x0a4a4248|0x16465254|0x37477374|0x2080a0a0|0x2dcde1ec|0x06464244|0x3585b1b4|0x2b0b2328|0x25456164|0x3acaf2f8|0x23c3e3e0|0x3989b1b8|0x3181b1b0|0x1f8f939c|0x1e4e525c|0x39c9f1f8|0x26c6e2e4|0x3282b2b0|0x31013130|0x2acae2e8|0x2d4d616c|0x1f4f535c|0x24c4e0e4|0x30c0f0f0|0x0dcdc1cc|0x08888088|0x16061214|0x3a0a3238|0x18485058||0x14c4d0d4|0x22426260|0x29092128|0x07070304|0x33033330|0x28c8e0e8|0x1b0b1318|0x05050104|0x39497178|0x10809090|0x2a4a6268|0x2a0a2228|0x1a8a9298|0x38380830|0xe828c8e0|0x2c2d0d21|0xa42686a2|0xcc0fcfc3|0xdc1eced2|0xb03383b3|0xb83888b0|0xac2f8fa3|0x60204060|0x54154551|0xc407c7c3|0x44044440|0x6c2f4f63|0x682b4b63|0x581b4b53|0xc003c3c3|0x60224262|0x30330333|0xb43585b1|0x28290921|0xa02080a0|0xe022c2e2|0xa42787a3|0xd013c3d3|0x90118191|0x10110111|0x04060602|0x1c1c0c10|0xbc3c8cb0|0x34360632|0x480b4b43|0xec2fcfe3|0x88088880|0x6c2c4c60|0xa82888a0|0x14170713|0xc404c4c0|0x14160612|0xf434c4f0|0xc002c2c2|0x44054541|0xe021c1e1|0xd416c6d2|0x3c3f0f33|0x3c3d0d31|0x8c0e8e82|0x98188890|0x28280820|0x4c0e4e42|0xf436c6f2|0x3c3e0e32|0xa42585a1|0xf839c9f1|0x0c0d0d01|0xdc1fcfd3|0xd818c8d0|0x282b0b23|0x64264662|0x783a4a72|0x24270723|0x2c2f0f23||0xf031c1f1|0x70324272|0x40024242|0xd414c4d0|0x40014141||0xc000c0c0|0x70334373|0x64274763|0xac2c8ca0|0x880b8b83|0xf437c7f3|0xac2d8da1|0x80008080|0x1c1f0f13|0xc80acac2|0x2c2c0c20|0xa82a8aa2|0x34340430|0xd012c2d2|0x080b0b03|0xec2ecee2|0xe829c9e1|0x5c1d4d51|0x94148490|0x18180810|0xf838c8f0|0x54174753|0xac2e8ea2|0x08080800|0xc405c5c1|0x10130313|0xcc0dcdc1|0x84068682|0xb83989b1|0xfc3fcff3|0x7c3d4d71|0xc001c1c1|0x30310131|0xf435c5f1|0x880a8a82|0x682a4a62|0xb03181b1|0xd011c1d1|0x20200020|0xd417c7d3|0x00020202|0x20220222|0x04040400|0x68284860|0x70314171|0x04070703|0xd81bcbd3|0x9c1d8d91||0x98198991|0x60214161|0xbc3e8eb2||0xe426c6e2|0x58194951|0xdc1dcdd1|0x50114151|0x90108090|0xdc1cccd0|0x981a8a92|0xa02383a3|0xa82b8ba3|0xd010c0d0|0x80018181|0x0c0f0f03|0x44074743|0x181a0a12|0xe023c3e3|0xec2ccce0|0x8c0d8d81|0xbc3f8fb3|0x94168692|0x783b4b73|0x5c1c4c50|0xa02282a2|0xa02181a1|0x60234363|0x20230323|0x4c0d4d41|0xc808c8c0|0x9c1e8e92|0x9c1c8c90|0x383a0a32|0x0c0c0c00|0x2c2e0e22|0xb83a8ab2|0x6c2e4e62|0x9c1f8f93|0x581a4a52|0xf032c2f2|0x90128292|0xf033c3f3|0x48094941|0x78384870|0xcc0cccc0|0x14150511|0xf83bcbf3|||0x70304070|0x74354571|0x7c3f4f73|0x34350531|0x10100010|0x00030303|0x64244460|0x6c2d4d61|0xc406c6c2|0x74344470|0xd415c5d1|0xb43484b0|0xe82acae2|0x08090901|0x74364672|0x18190911|0xfc3ecef2|0x40004040|0x10120212|0xe020c0e0|0xbc3d8db1|0x04050501|0xf83acaf2|0x00010101|0xf030c0f0|0x282a0a22|0x5c1e4e52|0xa82989a1|0x54164652|0x40034343|0x84058581|0x14140410|0x88098981|0x981b8b93|0xb03080b0|0xe425c5e1|0x48084840|0x78394971|0x94178793|0xfc3cccf0|0x1c1e0e12|0x80028282|0x20210121|0x8c0c8c80|0x181b0b13|0x5c1f4f53|0x74374773|0x54144450|0xb03282b2|0x1c1d0d11|0x24250521|0x4c0f4f43|0x44064642|0xec2dcde1|0x58184850|0x50124252|0xe82bcbe3|0x7c3e4e72|0xd81acad2|0xc809c9c1|0xfc3dcdf1|0x30300030|0x94158591|0x64254561|0x3c3c0c30|0xb43686b2|0xe424c4e0|0xb83b8bb3|0x7c3c4c70|0x0c0e0e02|0x50104050|0x38390931|0x24260622|0x30320232|0x84048480|0x68294961|0x90138393|0x34370733|0xe427c7e3|0x24240420|0xa42484a0|0xc80bcbc3|0x50134353|0x080a0a02|0x84078783|0xd819c9d1|0x4c0c4c40|0x80038383|0x8c0f8f83|0xcc0ecec2|0x383b0b33|0x480a4a42|0xb43787b3|0xa1a82989|0x81840585|0xd2d416c6|0xd3d013c3|0x50541444|0x111c1d0d|0xa0ac2c8c|0x21242505|0x515c1d4d|0x43400343|0x10181808|0x121c1e0e|0x51501141|0xf0fc3ccc|0xc2c80aca|0x63602343|0x20282808|0x40440444|0x20202000|0x919c1d8d|0xe0e020c0|0xe2e022c2|0xc0c808c8|0x13141707|0xa1a42585|0x838c0f8f|0x03000303|0x73783b4b|0xb3b83b8b|0x13101303|0xd2d012c2|0xe2ec2ece|0x70703040|0x808c0c8c|0x333c3f0f|0xa0a82888|0x32303202|0xd1dc1dcd|0xf2f436c6|0x70743444|0xe0ec2ccc|0x91941585|0x03080b0b|0x53541747|0x505c1c4c|0x53581b4b|0xb1bc3d8d|0x01000101|0x20242404|0x101c1c0c|0x73703343|0x90981888|0x10101000|0xc0cc0ccc|0xf2f032c2|0xd1d819c9|0x202c2c0c|0xe3e427c7|0x72703242|0x83800383|0x93981b8b|0xd1d011c1|0x82840686|0xc1c809c9|0x60602040|0x50501040|0xa3a02383|0xe3e82bcb|0x010c0d0d|0xb2b43686|0x929c1e8e|0x434c0f4f|0xb3b43787|0x52581a4a|0xc2c406c6|0x70783848|0xa2a42686|0x12101202|0xa3ac2f8f|0xd1d415c5|0x61602141|0xc3c003c3|0xb0b43484|0x41400141|0x52501242|0x717c3d4d|0x818c0d8d|0x00080808|0x131c1f0f|0x91981989|0x11181909|0x00040404|0x53501343|0xf3f437c7|0xe1e021c1|0xf1fc3dcd|0x72743646|0x232c2f0f|0x23242707|0xb0b03080|0x83880b8b|0x020c0e0e|0xa3a82b8b|0xa2a02282|0x626c2e4e|0x93901383|0x414c0d4d|0x61682949|0x707c3c4c|0x01080909|0x02080a0a|0xb3bc3f8f|0xe3ec2fcf|0xf3f033c3|0xc1c405c5|0x83840787|0x10141404|0xf2fc3ece|0x60642444|0xd2dc1ece|0x222c2e0e|0x43480b4b|0x12181a0a|0x02040606|0x21202101|0x63682b4b|0x62642646|0x02000202|0xf1f435c5|0x92901282|0x82880a8a|0x000c0c0c|0xb3b03383|0x727c3e4e|0xd0d010c0|0x72783a4a|0x43440747|0x92941686|0xe1e425c5|0x22242606|0x80800080|0xa1ac2d8d|0xd3dc1fcf|0xa1a02181|0x30303000|0x33343707|0xa2ac2e8e|0x32343606|0x11141505|0x22202202|0x30383808|0xf0f434c4|0xa3a42787|0x41440545|0x404c0c4c|0x81800181|0xe1e829c9|0x80840484|0x93941787|0x31343505|0xc3c80bcb|0xc2cc0ece|0x303c3c0c|0x71703141|0x11101101|0xc3c407c7|0x81880989|0x71743545|0xf3f83bcb|0xd2d81aca|0xf0f838c8|0x90941484|0x51581949|0x82800282|0xc0c404c4|0xf3fc3fcf|0x41480949|0x31383909|0x63642747|0xc0c000c0|0xc3cc0fcf|0xd3d417c7|0xb0b83888|0x030c0f0f|0x828c0e8e|0x42400242|0x23202303|0x91901181|0x606c2c4c|0xd3d81bcb|0xa0a42484|0x30343404|0xf1f031c1|0x40480848|0xc2c002c2|0x636c2f4f|0x313c3d0d|0x212c2d0d|0x40400040|0xb2bc3e8e|0x323c3e0e|0xb0bc3c8c|0xc1c001c1|0xa2a82a8a|0xb2b83a8a|0x424c0e4e|0x51541545|0x33383b0b|0xd0dc1ccc|0x60682848|0x737c3f4f|0x909c1c8c|0xd0d818c8|0x42480a4a|0x52541646|0x73743747|0xa0a02080|0xe1ec2dcd|0x42440646|0xb1b43585|0x23282b0b|0x61642545|0xf2f83aca|0xe3e023c3|0xb1b83989|0xb1b03181|0x939c1f8f|0x525c1e4e|0xf1f839c9|0xe2e426c6|0xb2b03282|0x31303101|0xe2e82aca|0x616c2d4d|0x535c1f4f|0xe0e424c4|0xf0f030c0|0xc1cc0dcd|0x80880888|0x12141606|0x32383a0a|0x50581848|0xd0d414c4|0x62602242|0x21282909|0x03040707|0x33303303|0xe0e828c8|0x13181b0b|0x01040505|0x71783949|0x90901080|0x62682a4a|0x22282a0a|0x92981a8a|0x08303838|0xc8e0e828|0x0d212c2d|0x86a2a426|0xcfc3cc0f|0xced2dc1e|0x83b3b033|0x88b0b838|0x8fa3ac2f|0x40606020|0x45515415|0xc7c3c407|0x44404404|0x4f636c2f|0x4b63682b|0x4b53581b|0xc3c3c003|0x42626022|0x03333033|0x85b1b435|0x09212829|0x80a0a020||0xc2e2e022|0x87a3a427|0xc3d3d013|0x81919011|0x01111011|0x06020406|0x0c101c1c|0x8cb0bc3c|0x06323436|0x4b43480b|0xcfe3ec2f|0x88808808|0x4c606c2c||0x88a0a828|0x07131417|0xc4c0c404|0x06121416|0xc4f0f434|0xc2c2c002|0x45414405|0xc1e1e021|0xc6d2d416|0x0f333c3f|0x0d313c3d|0x8e828c0e|0x88909818|0x08202828|0x4e424c0e||0xc6f2f436|0x0e323c3e|0x85a1a425|0xc9f1f839|0x0d010c0d|0xcfd3dc1f|0xc8d0d818|0x0b23282b|0x46626426|0x4a72783a|0x07232427|0x0f232c2f|0xc1f1f031|0x42727032|0x42424002|0xc4d0d414|0x41414001|0xc0c0c000|0x43737033|0x47636427|0x8ca0ac2c|0x8b83880b|0xc7f3f437|0x8da1ac2d|0x80808000|0x0f131c1f|0xcac2c80a|0x0c202c2c|0x8aa2a82a|0x04303434|0xc2d2d012|0x0b03080b|0xcee2ec2e|0xc9e1e829|0x4d515c1d|0x84909414|0x08101818|0xc8f0f838|0x47535417|0x8ea2ac2e|0x08000808|0xc5c1c405|0x03131013|0xcdc1cc0d|0x86828406|0x89b1b839|0xcff3fc3f|0x4d717c3d|0xc1c1c001|0x01313031|0xc5f1f435|0x8a82880a|0x4a62682a|0x81b1b031|0xc1d1d011|0x00202020|0xc7d3d417|0x02020002|0x02222022|0x04000404|0x48606828|0x41717031|0x07030407|0xcbd3d81b|0x8d919c1d|0x89919819|0x41616021|0x8eb2bc3e|0xc6e2e426|0x49515819|0xcdd1dc1d|0x41515011|0x80909010|0xccd0dc1c|0x8a92981a|0x83a3a023|0x8ba3a82b|0xc0d0d010|0x81818001|0x0f030c0f|0x47434407|0x0a12181a|0xc3e3e023|0xcce0ec2c|0x8d818c0d|0x8fb3bc3f|0x86929416|0x4b73783b|0x4c505c1c|0x82a2a022|0x81a1a021|0x43636023|0x03232023|0x4d414c0d|0xc8c0c808|0x8e929c1e|0x8c909c1c|0x0a32383a|0x0c000c0c|0x0e222c2e|0x8ab2b83a|0x4e626c2e|0x8f939c1f|0x4a52581a|0xc2f2f032|0x82929012|0xc3f3f033|0x49414809|0x48707838|0xccc0cc0c|0x05111415|0xcbf3f83b|0x40707030|0x45717435|0x4f737c3f|0x05313435|0x00101010|0x03030003|0x44606424|0x4d616c2d|0xc6c2c406|0x44707434|0xc5d1d415|0x84b0b434|0xcae2e82a|0x09010809|0x46727436|0x09111819|0xcef2fc3e|0x40404000|0x02121012|0xc0e0e020|0x8db1bc3d|0x05010405|0xcaf2f83a|0x01010001|0xc0f0f030|0x0a22282a|0x4e525c1e|0x89a1a829|0x46525416|0x43434003|0x85818405|0x04101414|0x89818809|0x8b93981b|0x80b0b030|0xc5e1e425|0x48404808|0x49717839|0x87939417|0xccf0fc3c|0x0e121c1e|0x82828002|0x01212021|0x8c808c0c|0x0b13181b|0x4f535c1f|0x47737437|0x44505414|0x82b2b032|0x0d111c1d|0x05212425|0x4f434c0f|0x46424406|0xcde1ec2d|0x48505818|0x42525012|0xcbe3e82b|0x4e727c3e|0xcad2d81a|0xc9c1c809|0xcdf1fc3d|0x00303030|0x85919415|0x45616425|0x0c303c3c|0x86b2b436|0xc4e0e424|0x8bb3b83b|0x4c707c3c|0x0e020c0e|0x40505010|0x09313839|0x06222426|0x02323032|0x84808404|0x49616829|0x83939013|0x07333437|0xc7e3e427|0x04202424|0x84a0a424|0xcbc3c80b|0x43535013|0x0a02080a|0x87838407|0xc9d1d819|0x4c404c0c|0x83838003|0x8f838c0f|0xcec2cc0e|0x0b33383b|0x4a42480a|0x87b3b437|0x9e3779b9|0x3c6ef373|0x78dde6e6|0xf1bbcdcc|0xe3779b99|0xc6ef3733|0x8dde6e67|0x1bbcdccf|0x3779b99e|0x6ef3733c|0xdde6e678|0xbbcdccf1|0x779b99e3|0xef3733c6|0xde6e678d|0xbcdccf1b|tk_Random|random|navigator|Opera|Safari|Chrome|Firefox|Microsoft|Internet|Explorer|Netscape|toLowerCase|trident|throw|Exception|must|larger|than|log|pow|256|Uint8Array|crypto|msCrypto|try||123456789|987654321|0xffffffff|36969|18000|4294967296|parseInt|catch'.split('|'), 0, {}))


function SeedEnc(geo, sessionKey) {
    const iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30];	// "MobileTransKey10"
    const inData = new Array(16);
    const outData = new Array(16);
    const roundKey = new Array(32);

    for (var i = 0; i < geo.length; i++) {
        if (geo.charAt(i) == "l" || geo.charAt(i) == "u" || geo.charAt(i) == "d") {
            inData[i] = Number(geo.charCodeAt(i));
            continue;
        } else if (geo.charAt(i) == " ") {
            inData[i] = Number(geo.charCodeAt(i));
            continue;
        }
        inData[i] = Number(geo.charAt(i).toString(16));
    }
    inData[geo.length] = 32;		//" "
    inData[geo.length + 1] = 101;	//e

    const rndInt = genKey.tk_getrnd_int();
    inData[geo.length + 2] = rndInt % 100;

    Seed.SeedSetKey(roundKey, sessionKey);
    Seed.SeedEncryptCbc(roundKey, iv, inData, 16, outData);

    const encodedData = new Array(16);
    let encodedDataString = "";
    for (var i = 0; i < 16; i++) {
        if (encDelimiter == null)
            encodedData[i] = Number(outData[i]).toString(16);
        else
            encodedDataString += Number(outData[i]).toString(16) + encDelimiter;
    }


    if (encDelimiter == null)
        return encodedData;
    else
        return encodedDataString.substring(0, encodedDataString.length - 1);
}

function pack(source) {
    let temp = "";
    for (let i = 0; i < source.length; i += 2) {
        temp += String.fromCharCode(parseInt(source.substring(i, i + 2), 16));
    }
    return temp;
}

function char2hex(source) {
    let hex = "";
    for (let i = 0; i < source.length; i += 1) {
        let temp = source[i].toString(16);
        switch (temp.length) {
            case 1:
                temp = "0" + temp;
                break;
            case 0:
                temp = "00";
        }
        hex += temp;
    }
    return hex;
}

function xor(a, b) {
    let length = Math.min(a.length, b.length);
    let temp = "";
    for (var i = 0; i < length; i++) {
        temp += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
    }
    length = Math.max(a.length, b.length) - length;
    for (var i = 0; i < length; i++) {
        temp += "\x00";
    }
    return temp;
}

function sha1Hash(msg) {
    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    msg += String.fromCharCode(0x80);
    const l = msg.length / 4 + 2;
    const N = Math.ceil(l / 16);
    const M = new Array(N);
    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) | (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3))
        }
    }
    M[N - 1][14] = ((msg.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]);
    M[N - 1][15] = ((msg.length - 1) * 8) & 0xffffffff;
    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;
    const W = new Array(80);
    let a, b, c, d, e;
    for (var i = 0; i < N; i++) {
        for (var t = 0; t < 16; t++)
            W[t] = M[i][t];
        for (var t = 16; t < 80; t++)
            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
        a = H0;
        b = H1;
        c = H2;
        d = H3;
        e = H4;
        for (var t = 0; t < 80; t++) {
            const s = Math.floor(t / 20);
            const T = (ROTL(a, 5) + tk_f_(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = ROTL(b, 30);
            b = a;
            a = T
        }
        H0 = (H0 + a) & 0xffffffff;
        H1 = (H1 + b) & 0xffffffff;
        H2 = (H2 + c) & 0xffffffff;
        H3 = (H3 + d) & 0xffffffff;
        H4 = (H4 + e) & 0xffffffff
    }
    return H0.toHexStr() + H1.toHexStr() + H2.toHexStr() + H3.toHexStr() + H4.toHexStr()
}

function tk_f_(s, x, y, z) {
    switch (s) {
        case 0:
            return (x & y) ^ (~x & z);
        case 1:
            return x ^ y ^ z;
        case 2:
            return (x & y) ^ (x & z) ^ (y & z);
        case 3:
            return x ^ y ^ z
    }
}

function ROTL(x, n) {
    return (x << n) | (x >>> (32 - n))
}

Number.prototype.toHexStr = function () {
    let s = "", v;
    for (let i = 7; i >= 0; i--) {
        v = (this >>> (i * 4)) & 0xf;
        s += v.toString(16)
    }
    return s
}
;
const Rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];
const S = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22];
const T1 = [0xa56363c6, 0x847c7cf8, 0x997777ee, 0x8d7b7bf6, 0x0df2f2ff, 0xbd6b6bd6, 0xb16f6fde, 0x54c5c591, 0x50303060, 0x03010102, 0xa96767ce, 0x7d2b2b56, 0x19fefee7, 0x62d7d7b5, 0xe6abab4d, 0x9a7676ec, 0x45caca8f, 0x9d82821f, 0x40c9c989, 0x877d7dfa, 0x15fafaef, 0xeb5959b2, 0xc947478e, 0x0bf0f0fb, 0xecadad41, 0x67d4d4b3, 0xfda2a25f, 0xeaafaf45, 0xbf9c9c23, 0xf7a4a453, 0x967272e4, 0x5bc0c09b, 0xc2b7b775, 0x1cfdfde1, 0xae93933d, 0x6a26264c, 0x5a36366c, 0x413f3f7e, 0x02f7f7f5, 0x4fcccc83, 0x5c343468, 0xf4a5a551, 0x34e5e5d1, 0x08f1f1f9, 0x937171e2, 0x73d8d8ab, 0x53313162, 0x3f15152a, 0x0c040408, 0x52c7c795, 0x65232346, 0x5ec3c39d, 0x28181830, 0xa1969637, 0x0f05050a, 0xb59a9a2f, 0x0907070e, 0x36121224, 0x9b80801b, 0x3de2e2df, 0x26ebebcd, 0x6927274e, 0xcdb2b27f, 0x9f7575ea, 0x1b090912, 0x9e83831d, 0x742c2c58, 0x2e1a1a34, 0x2d1b1b36, 0xb26e6edc, 0xee5a5ab4, 0xfba0a05b, 0xf65252a4, 0x4d3b3b76, 0x61d6d6b7, 0xceb3b37d, 0x7b292952, 0x3ee3e3dd, 0x712f2f5e, 0x97848413, 0xf55353a6, 0x68d1d1b9, 0x00000000, 0x2cededc1, 0x60202040, 0x1ffcfce3, 0xc8b1b179, 0xed5b5bb6, 0xbe6a6ad4, 0x46cbcb8d, 0xd9bebe67, 0x4b393972, 0xde4a4a94, 0xd44c4c98, 0xe85858b0, 0x4acfcf85, 0x6bd0d0bb, 0x2aefefc5, 0xe5aaaa4f, 0x16fbfbed, 0xc5434386, 0xd74d4d9a, 0x55333366, 0x94858511, 0xcf45458a, 0x10f9f9e9, 0x06020204, 0x817f7ffe, 0xf05050a0, 0x443c3c78, 0xba9f9f25, 0xe3a8a84b, 0xf35151a2, 0xfea3a35d, 0xc0404080, 0x8a8f8f05, 0xad92923f, 0xbc9d9d21, 0x48383870, 0x04f5f5f1, 0xdfbcbc63, 0xc1b6b677, 0x75dadaaf, 0x63212142, 0x30101020, 0x1affffe5, 0x0ef3f3fd, 0x6dd2d2bf, 0x4ccdcd81, 0x140c0c18, 0x35131326, 0x2fececc3, 0xe15f5fbe, 0xa2979735, 0xcc444488, 0x3917172e, 0x57c4c493, 0xf2a7a755, 0x827e7efc, 0x473d3d7a, 0xac6464c8, 0xe75d5dba, 0x2b191932, 0x957373e6, 0xa06060c0, 0x98818119, 0xd14f4f9e, 0x7fdcdca3, 0x66222244, 0x7e2a2a54, 0xab90903b, 0x8388880b, 0xca46468c, 0x29eeeec7, 0xd3b8b86b, 0x3c141428, 0x79dedea7, 0xe25e5ebc, 0x1d0b0b16, 0x76dbdbad, 0x3be0e0db, 0x56323264, 0x4e3a3a74, 0x1e0a0a14, 0xdb494992, 0x0a06060c, 0x6c242448, 0xe45c5cb8, 0x5dc2c29f, 0x6ed3d3bd, 0xefacac43, 0xa66262c4, 0xa8919139, 0xa4959531, 0x37e4e4d3, 0x8b7979f2, 0x32e7e7d5, 0x43c8c88b, 0x5937376e, 0xb76d6dda, 0x8c8d8d01, 0x64d5d5b1, 0xd24e4e9c, 0xe0a9a949, 0xb46c6cd8, 0xfa5656ac, 0x07f4f4f3, 0x25eaeacf, 0xaf6565ca, 0x8e7a7af4, 0xe9aeae47, 0x18080810, 0xd5baba6f, 0x887878f0, 0x6f25254a, 0x722e2e5c, 0x241c1c38, 0xf1a6a657, 0xc7b4b473, 0x51c6c697, 0x23e8e8cb, 0x7cdddda1, 0x9c7474e8, 0x211f1f3e, 0xdd4b4b96, 0xdcbdbd61, 0x868b8b0d, 0x858a8a0f, 0x907070e0, 0x423e3e7c, 0xc4b5b571, 0xaa6666cc, 0xd8484890, 0x05030306, 0x01f6f6f7, 0x120e0e1c, 0xa36161c2, 0x5f35356a, 0xf95757ae, 0xd0b9b969, 0x91868617, 0x58c1c199, 0x271d1d3a, 0xb99e9e27, 0x38e1e1d9, 0x13f8f8eb, 0xb398982b, 0x33111122, 0xbb6969d2, 0x70d9d9a9, 0x898e8e07, 0xa7949433, 0xb69b9b2d, 0x221e1e3c, 0x92878715, 0x20e9e9c9, 0x49cece87, 0xff5555aa, 0x78282850, 0x7adfdfa5, 0x8f8c8c03, 0xf8a1a159, 0x80898909, 0x170d0d1a, 0xdabfbf65, 0x31e6e6d7, 0xc6424284, 0xb86868d0, 0xc3414182, 0xb0999929, 0x772d2d5a, 0x110f0f1e, 0xcbb0b07b, 0xfc5454a8, 0xd6bbbb6d, 0x3a16162c];
const T2 = [0x6363c6a5, 0x7c7cf884, 0x7777ee99, 0x7b7bf68d, 0xf2f2ff0d, 0x6b6bd6bd, 0x6f6fdeb1, 0xc5c59154, 0x30306050, 0x01010203, 0x6767cea9, 0x2b2b567d, 0xfefee719, 0xd7d7b562, 0xabab4de6, 0x7676ec9a, 0xcaca8f45, 0x82821f9d, 0xc9c98940, 0x7d7dfa87, 0xfafaef15, 0x5959b2eb, 0x47478ec9, 0xf0f0fb0b, 0xadad41ec, 0xd4d4b367, 0xa2a25ffd, 0xafaf45ea, 0x9c9c23bf, 0xa4a453f7, 0x7272e496, 0xc0c09b5b, 0xb7b775c2, 0xfdfde11c, 0x93933dae, 0x26264c6a, 0x36366c5a, 0x3f3f7e41, 0xf7f7f502, 0xcccc834f, 0x3434685c, 0xa5a551f4, 0xe5e5d134, 0xf1f1f908, 0x7171e293, 0xd8d8ab73, 0x31316253, 0x15152a3f, 0x0404080c, 0xc7c79552, 0x23234665, 0xc3c39d5e, 0x18183028, 0x969637a1, 0x05050a0f, 0x9a9a2fb5, 0x07070e09, 0x12122436, 0x80801b9b, 0xe2e2df3d, 0xebebcd26, 0x27274e69, 0xb2b27fcd, 0x7575ea9f, 0x0909121b, 0x83831d9e, 0x2c2c5874, 0x1a1a342e, 0x1b1b362d, 0x6e6edcb2, 0x5a5ab4ee, 0xa0a05bfb, 0x5252a4f6, 0x3b3b764d, 0xd6d6b761, 0xb3b37dce, 0x2929527b, 0xe3e3dd3e, 0x2f2f5e71, 0x84841397, 0x5353a6f5, 0xd1d1b968, 0x00000000, 0xededc12c, 0x20204060, 0xfcfce31f, 0xb1b179c8, 0x5b5bb6ed, 0x6a6ad4be, 0xcbcb8d46, 0xbebe67d9, 0x3939724b, 0x4a4a94de, 0x4c4c98d4, 0x5858b0e8, 0xcfcf854a, 0xd0d0bb6b, 0xefefc52a, 0xaaaa4fe5, 0xfbfbed16, 0x434386c5, 0x4d4d9ad7, 0x33336655, 0x85851194, 0x45458acf, 0xf9f9e910, 0x02020406, 0x7f7ffe81, 0x5050a0f0, 0x3c3c7844, 0x9f9f25ba, 0xa8a84be3, 0x5151a2f3, 0xa3a35dfe, 0x404080c0, 0x8f8f058a, 0x92923fad, 0x9d9d21bc, 0x38387048, 0xf5f5f104, 0xbcbc63df, 0xb6b677c1, 0xdadaaf75, 0x21214263, 0x10102030, 0xffffe51a, 0xf3f3fd0e, 0xd2d2bf6d, 0xcdcd814c, 0x0c0c1814, 0x13132635, 0xececc32f, 0x5f5fbee1, 0x979735a2, 0x444488cc, 0x17172e39, 0xc4c49357, 0xa7a755f2, 0x7e7efc82, 0x3d3d7a47, 0x6464c8ac, 0x5d5dbae7, 0x1919322b, 0x7373e695, 0x6060c0a0, 0x81811998, 0x4f4f9ed1, 0xdcdca37f, 0x22224466, 0x2a2a547e, 0x90903bab, 0x88880b83, 0x46468cca, 0xeeeec729, 0xb8b86bd3, 0x1414283c, 0xdedea779, 0x5e5ebce2, 0x0b0b161d, 0xdbdbad76, 0xe0e0db3b, 0x32326456, 0x3a3a744e, 0x0a0a141e, 0x494992db, 0x06060c0a, 0x2424486c, 0x5c5cb8e4, 0xc2c29f5d, 0xd3d3bd6e, 0xacac43ef, 0x6262c4a6, 0x919139a8, 0x959531a4, 0xe4e4d337, 0x7979f28b, 0xe7e7d532, 0xc8c88b43, 0x37376e59, 0x6d6ddab7, 0x8d8d018c, 0xd5d5b164, 0x4e4e9cd2, 0xa9a949e0, 0x6c6cd8b4, 0x5656acfa, 0xf4f4f307, 0xeaeacf25, 0x6565caaf, 0x7a7af48e, 0xaeae47e9, 0x08081018, 0xbaba6fd5, 0x7878f088, 0x25254a6f, 0x2e2e5c72, 0x1c1c3824, 0xa6a657f1, 0xb4b473c7, 0xc6c69751, 0xe8e8cb23, 0xdddda17c, 0x7474e89c, 0x1f1f3e21, 0x4b4b96dd, 0xbdbd61dc, 0x8b8b0d86, 0x8a8a0f85, 0x7070e090, 0x3e3e7c42, 0xb5b571c4, 0x6666ccaa, 0x484890d8, 0x03030605, 0xf6f6f701, 0x0e0e1c12, 0x6161c2a3, 0x35356a5f, 0x5757aef9, 0xb9b969d0, 0x86861791, 0xc1c19958, 0x1d1d3a27, 0x9e9e27b9, 0xe1e1d938, 0xf8f8eb13, 0x98982bb3, 0x11112233, 0x6969d2bb, 0xd9d9a970, 0x8e8e0789, 0x949433a7, 0x9b9b2db6, 0x1e1e3c22, 0x87871592, 0xe9e9c920, 0xcece8749, 0x5555aaff, 0x28285078, 0xdfdfa57a, 0x8c8c038f, 0xa1a159f8, 0x89890980, 0x0d0d1a17, 0xbfbf65da, 0xe6e6d731, 0x424284c6, 0x6868d0b8, 0x414182c3, 0x999929b0, 0x2d2d5a77, 0x0f0f1e11, 0xb0b07bcb, 0x5454a8fc, 0xbbbb6dd6, 0x16162c3a];
const T3 = [0x63c6a563, 0x7cf8847c, 0x77ee9977, 0x7bf68d7b, 0xf2ff0df2, 0x6bd6bd6b, 0x6fdeb16f, 0xc59154c5, 0x30605030, 0x01020301, 0x67cea967, 0x2b567d2b, 0xfee719fe, 0xd7b562d7, 0xab4de6ab, 0x76ec9a76, 0xca8f45ca, 0x821f9d82, 0xc98940c9, 0x7dfa877d, 0xfaef15fa, 0x59b2eb59, 0x478ec947, 0xf0fb0bf0, 0xad41ecad, 0xd4b367d4, 0xa25ffda2, 0xaf45eaaf, 0x9c23bf9c, 0xa453f7a4, 0x72e49672, 0xc09b5bc0, 0xb775c2b7, 0xfde11cfd, 0x933dae93, 0x264c6a26, 0x366c5a36, 0x3f7e413f, 0xf7f502f7, 0xcc834fcc, 0x34685c34, 0xa551f4a5, 0xe5d134e5, 0xf1f908f1, 0x71e29371, 0xd8ab73d8, 0x31625331, 0x152a3f15, 0x04080c04, 0xc79552c7, 0x23466523, 0xc39d5ec3, 0x18302818, 0x9637a196, 0x050a0f05, 0x9a2fb59a, 0x070e0907, 0x12243612, 0x801b9b80, 0xe2df3de2, 0xebcd26eb, 0x274e6927, 0xb27fcdb2, 0x75ea9f75, 0x09121b09, 0x831d9e83, 0x2c58742c, 0x1a342e1a, 0x1b362d1b, 0x6edcb26e, 0x5ab4ee5a, 0xa05bfba0, 0x52a4f652, 0x3b764d3b, 0xd6b761d6, 0xb37dceb3, 0x29527b29, 0xe3dd3ee3, 0x2f5e712f, 0x84139784, 0x53a6f553, 0xd1b968d1, 0x00000000, 0xedc12ced, 0x20406020, 0xfce31ffc, 0xb179c8b1, 0x5bb6ed5b, 0x6ad4be6a, 0xcb8d46cb, 0xbe67d9be, 0x39724b39, 0x4a94de4a, 0x4c98d44c, 0x58b0e858, 0xcf854acf, 0xd0bb6bd0, 0xefc52aef, 0xaa4fe5aa, 0xfbed16fb, 0x4386c543, 0x4d9ad74d, 0x33665533, 0x85119485, 0x458acf45, 0xf9e910f9, 0x02040602, 0x7ffe817f, 0x50a0f050, 0x3c78443c, 0x9f25ba9f, 0xa84be3a8, 0x51a2f351, 0xa35dfea3, 0x4080c040, 0x8f058a8f, 0x923fad92, 0x9d21bc9d, 0x38704838, 0xf5f104f5, 0xbc63dfbc, 0xb677c1b6, 0xdaaf75da, 0x21426321, 0x10203010, 0xffe51aff, 0xf3fd0ef3, 0xd2bf6dd2, 0xcd814ccd, 0x0c18140c, 0x13263513, 0xecc32fec, 0x5fbee15f, 0x9735a297, 0x4488cc44, 0x172e3917, 0xc49357c4, 0xa755f2a7, 0x7efc827e, 0x3d7a473d, 0x64c8ac64, 0x5dbae75d, 0x19322b19, 0x73e69573, 0x60c0a060, 0x81199881, 0x4f9ed14f, 0xdca37fdc, 0x22446622, 0x2a547e2a, 0x903bab90, 0x880b8388, 0x468cca46, 0xeec729ee, 0xb86bd3b8, 0x14283c14, 0xdea779de, 0x5ebce25e, 0x0b161d0b, 0xdbad76db, 0xe0db3be0, 0x32645632, 0x3a744e3a, 0x0a141e0a, 0x4992db49, 0x060c0a06, 0x24486c24, 0x5cb8e45c, 0xc29f5dc2, 0xd3bd6ed3, 0xac43efac, 0x62c4a662, 0x9139a891, 0x9531a495, 0xe4d337e4, 0x79f28b79, 0xe7d532e7, 0xc88b43c8, 0x376e5937, 0x6ddab76d, 0x8d018c8d, 0xd5b164d5, 0x4e9cd24e, 0xa949e0a9, 0x6cd8b46c, 0x56acfa56, 0xf4f307f4, 0xeacf25ea, 0x65caaf65, 0x7af48e7a, 0xae47e9ae, 0x08101808, 0xba6fd5ba, 0x78f08878, 0x254a6f25, 0x2e5c722e, 0x1c38241c, 0xa657f1a6, 0xb473c7b4, 0xc69751c6, 0xe8cb23e8, 0xdda17cdd, 0x74e89c74, 0x1f3e211f, 0x4b96dd4b, 0xbd61dcbd, 0x8b0d868b, 0x8a0f858a, 0x70e09070, 0x3e7c423e, 0xb571c4b5, 0x66ccaa66, 0x4890d848, 0x03060503, 0xf6f701f6, 0x0e1c120e, 0x61c2a361, 0x356a5f35, 0x57aef957, 0xb969d0b9, 0x86179186, 0xc19958c1, 0x1d3a271d, 0x9e27b99e, 0xe1d938e1, 0xf8eb13f8, 0x982bb398, 0x11223311, 0x69d2bb69, 0xd9a970d9, 0x8e07898e, 0x9433a794, 0x9b2db69b, 0x1e3c221e, 0x87159287, 0xe9c920e9, 0xce8749ce, 0x55aaff55, 0x28507828, 0xdfa57adf, 0x8c038f8c, 0xa159f8a1, 0x89098089, 0x0d1a170d, 0xbf65dabf, 0xe6d731e6, 0x4284c642, 0x68d0b868, 0x4182c341, 0x9929b099, 0x2d5a772d, 0x0f1e110f, 0xb07bcbb0, 0x54a8fc54, 0xbb6dd6bb, 0x162c3a16];
const T4 = [0xc6a56363, 0xf8847c7c, 0xee997777, 0xf68d7b7b, 0xff0df2f2, 0xd6bd6b6b, 0xdeb16f6f, 0x9154c5c5, 0x60503030, 0x02030101, 0xcea96767, 0x567d2b2b, 0xe719fefe, 0xb562d7d7, 0x4de6abab, 0xec9a7676, 0x8f45caca, 0x1f9d8282, 0x8940c9c9, 0xfa877d7d, 0xef15fafa, 0xb2eb5959, 0x8ec94747, 0xfb0bf0f0, 0x41ecadad, 0xb367d4d4, 0x5ffda2a2, 0x45eaafaf, 0x23bf9c9c, 0x53f7a4a4, 0xe4967272, 0x9b5bc0c0, 0x75c2b7b7, 0xe11cfdfd, 0x3dae9393, 0x4c6a2626, 0x6c5a3636, 0x7e413f3f, 0xf502f7f7, 0x834fcccc, 0x685c3434, 0x51f4a5a5, 0xd134e5e5, 0xf908f1f1, 0xe2937171, 0xab73d8d8, 0x62533131, 0x2a3f1515, 0x080c0404, 0x9552c7c7, 0x46652323, 0x9d5ec3c3, 0x30281818, 0x37a19696, 0x0a0f0505, 0x2fb59a9a, 0x0e090707, 0x24361212, 0x1b9b8080, 0xdf3de2e2, 0xcd26ebeb, 0x4e692727, 0x7fcdb2b2, 0xea9f7575, 0x121b0909, 0x1d9e8383, 0x58742c2c, 0x342e1a1a, 0x362d1b1b, 0xdcb26e6e, 0xb4ee5a5a, 0x5bfba0a0, 0xa4f65252, 0x764d3b3b, 0xb761d6d6, 0x7dceb3b3, 0x527b2929, 0xdd3ee3e3, 0x5e712f2f, 0x13978484, 0xa6f55353, 0xb968d1d1, 0x00000000, 0xc12ceded, 0x40602020, 0xe31ffcfc, 0x79c8b1b1, 0xb6ed5b5b, 0xd4be6a6a, 0x8d46cbcb, 0x67d9bebe, 0x724b3939, 0x94de4a4a, 0x98d44c4c, 0xb0e85858, 0x854acfcf, 0xbb6bd0d0, 0xc52aefef, 0x4fe5aaaa, 0xed16fbfb, 0x86c54343, 0x9ad74d4d, 0x66553333, 0x11948585, 0x8acf4545, 0xe910f9f9, 0x04060202, 0xfe817f7f, 0xa0f05050, 0x78443c3c, 0x25ba9f9f, 0x4be3a8a8, 0xa2f35151, 0x5dfea3a3, 0x80c04040, 0x058a8f8f, 0x3fad9292, 0x21bc9d9d, 0x70483838, 0xf104f5f5, 0x63dfbcbc, 0x77c1b6b6, 0xaf75dada, 0x42632121, 0x20301010, 0xe51affff, 0xfd0ef3f3, 0xbf6dd2d2, 0x814ccdcd, 0x18140c0c, 0x26351313, 0xc32fecec, 0xbee15f5f, 0x35a29797, 0x88cc4444, 0x2e391717, 0x9357c4c4, 0x55f2a7a7, 0xfc827e7e, 0x7a473d3d, 0xc8ac6464, 0xbae75d5d, 0x322b1919, 0xe6957373, 0xc0a06060, 0x19988181, 0x9ed14f4f, 0xa37fdcdc, 0x44662222, 0x547e2a2a, 0x3bab9090, 0x0b838888, 0x8cca4646, 0xc729eeee, 0x6bd3b8b8, 0x283c1414, 0xa779dede, 0xbce25e5e, 0x161d0b0b, 0xad76dbdb, 0xdb3be0e0, 0x64563232, 0x744e3a3a, 0x141e0a0a, 0x92db4949, 0x0c0a0606, 0x486c2424, 0xb8e45c5c, 0x9f5dc2c2, 0xbd6ed3d3, 0x43efacac, 0xc4a66262, 0x39a89191, 0x31a49595, 0xd337e4e4, 0xf28b7979, 0xd532e7e7, 0x8b43c8c8, 0x6e593737, 0xdab76d6d, 0x018c8d8d, 0xb164d5d5, 0x9cd24e4e, 0x49e0a9a9, 0xd8b46c6c, 0xacfa5656, 0xf307f4f4, 0xcf25eaea, 0xcaaf6565, 0xf48e7a7a, 0x47e9aeae, 0x10180808, 0x6fd5baba, 0xf0887878, 0x4a6f2525, 0x5c722e2e, 0x38241c1c, 0x57f1a6a6, 0x73c7b4b4, 0x9751c6c6, 0xcb23e8e8, 0xa17cdddd, 0xe89c7474, 0x3e211f1f, 0x96dd4b4b, 0x61dcbdbd, 0x0d868b8b, 0x0f858a8a, 0xe0907070, 0x7c423e3e, 0x71c4b5b5, 0xccaa6666, 0x90d84848, 0x06050303, 0xf701f6f6, 0x1c120e0e, 0xc2a36161, 0x6a5f3535, 0xaef95757, 0x69d0b9b9, 0x17918686, 0x9958c1c1, 0x3a271d1d, 0x27b99e9e, 0xd938e1e1, 0xeb13f8f8, 0x2bb39898, 0x22331111, 0xd2bb6969, 0xa970d9d9, 0x07898e8e, 0x33a79494, 0x2db69b9b, 0x3c221e1e, 0x15928787, 0xc920e9e9, 0x8749cece, 0xaaff5555, 0x50782828, 0xa57adfdf, 0x038f8c8c, 0x59f8a1a1, 0x09808989, 0x1a170d0d, 0x65dabfbf, 0xd731e6e6, 0x84c64242, 0xd0b86868, 0x82c34141, 0x29b09999, 0x5a772d2d, 0x1e110f0f, 0x7bcbb0b0, 0xa8fc5454, 0x6dd6bbbb, 0x2c3a1616];

function B0(x) {
    return (x & 255)
}

function B1(x) {
    return ((x >> 8) & 255)
}

function B2(x) {
    return ((x >> 16) & 255)
}

function B3(x) {
    return ((x >> 24) & 255)
}

function F1(x0, x1, x2, x3) {
    return B1(T1[x0 & 255]) | (B1(T1[(x1 >> 8) & 255]) << 8) | (B1(T1[(x2 >> 16) & 255]) << 16) | (B1(T1[x3 >>> 24]) << 24)
}

function packBytes(octets) {
    let i, j;
    const len = octets.length;
    const b = new Array(len / 4);
    if (!octets || len % 4)
        return;
    for (i = 0,
             j = 0; j < len; j += 4)
        b[i++] = octets[j] | (octets[j + 1] << 8) | (octets[j + 2] << 16) | (octets[j + 3] << 24);
    return b
}

function unpackBytes(packed) {
    let j;
    let i = 0
    ;const l = packed.length;
    const r = new Array(l * 4);
    for (j = 0; j < l; j++) {
        r[i++] = B0(packed[j]);
        r[i++] = B1(packed[j]);
        r[i++] = B2(packed[j]);
        r[i++] = B3(packed[j])
    }
    return r
}

const maxkc = 8;
const maxrk = 14;

function keyExpansion(key) {
    let kc, i, j, r, t;
    let rounds;
    const keySched = new Array(maxrk + 1);
    const keylen = key.length;
    const k = new Array(maxkc);
    const tk = new Array(maxkc);
    let rconpointer = 0;
    if (keylen == 16) {
        rounds = 10;
        kc = 4
    } else if (keylen == 24) {
        rounds = 12;
        kc = 6
    } else if (keylen == 32) {
        rounds = 14;
        kc = 8
    } else {
        alert('Invalid AES key length ' + keylen);
        return
    }
    for (i = 0; i < maxrk + 1; i++)
        keySched[i] = new Array(4);
    for (i = 0,
             j = 0; j < keylen; j++,
             i += 4)
        k[j] = key.charCodeAt(i) | (key.charCodeAt(i + 1) << 8) | (key.charCodeAt(i + 2) << 16) | (key.charCodeAt(i + 3) << 24);
    for (j = kc - 1; j >= 0; j--)
        tk[j] = k[j];
    r = 0;
    t = 0;
    for (j = 0; (j < kc) && (r < rounds + 1);) {
        for (; (j < kc) && (t < 4); j++,
            t++) {
            keySched[r][t] = tk[j]
        }
        if (t == 4) {
            r++;
            t = 0
        }
    }
    while (r < rounds + 1) {
        let temp = tk[kc - 1];
        tk[0] ^= S[B1(temp)] | (S[B2(temp)] << 8) | (S[B3(temp)] << 16) | (S[B0(temp)] << 24);
        tk[0] ^= Rcon[rconpointer++];
        if (kc != 8) {
            for (j = 1; j < kc; j++)
                tk[j] ^= tk[j - 1]
        } else {
            for (j = 1; j < kc / 2; j++)
                tk[j] ^= tk[j - 1];
            temp = tk[kc / 2 - 1];
            tk[kc / 2] ^= S[B0(temp)] | (S[B1(temp)] << 8) | (S[B2(temp)] << 16) | (S[B3(temp)] << 24);
            for (j = kc / 2 + 1; j < kc; j++)
                tk[j] ^= tk[j - 1]
        }
        for (j = 0; (j < kc) && (r < rounds + 1);) {
            for (; (j < kc) && (t < 4); j++,
                t++) {
                keySched[r][t] = tk[j]
            }
            if (t == 4) {
                r++;
                t = 0
            }
        }
    }
    this.rounds = rounds;
    this.rk = keySched;
    return this
}

function AESencrypt(block, ctx) {
    let r;
    let t0, t1, t2, t3;
    const b = packBytes(block);
    const rounds = ctx.rounds;
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    for (r = 0; r < rounds - 1; r++) {
        t0 = b0 ^ ctx.rk[r][0];
        t1 = b1 ^ ctx.rk[r][1];
        t2 = b2 ^ ctx.rk[r][2];
        t3 = b3 ^ ctx.rk[r][3];
        b0 = T1[t0 & 255] ^ T2[(t1 >> 8) & 255] ^ T3[(t2 >> 16) & 255] ^ T4[t3 >>> 24];
        b1 = T1[t1 & 255] ^ T2[(t2 >> 8) & 255] ^ T3[(t3 >> 16) & 255] ^ T4[t0 >>> 24];
        b2 = T1[t2 & 255] ^ T2[(t3 >> 8) & 255] ^ T3[(t0 >> 16) & 255] ^ T4[t1 >>> 24];
        b3 = T1[t3 & 255] ^ T2[(t0 >> 8) & 255] ^ T3[(t1 >> 16) & 255] ^ T4[t2 >>> 24]
    }
    r = rounds - 1;
    t0 = b0 ^ ctx.rk[r][0];
    t1 = b1 ^ ctx.rk[r][1];
    t2 = b2 ^ ctx.rk[r][2];
    t3 = b3 ^ ctx.rk[r][3];
    b[0] = F1(t0, t1, t2, t3) ^ ctx.rk[rounds][0];
    b[1] = F1(t1, t2, t3, t0) ^ ctx.rk[rounds][1];
    b[2] = F1(t2, t3, t0, t1) ^ ctx.rk[rounds][2];
    b[3] = F1(t3, t0, t1, t2) ^ ctx.rk[rounds][3];
    return unpackBytes(b)
}

function parseBigInt(str, r) {
    return new BigInteger(str, r)
}

const CryptoJS = function (g, l) {
    var e = {}
        , d = e.lib = {}
        , m = function () {
    }
        , k = d.Base = {
        extend: function (a) {
            m.prototype = this;
            const c = new m;
            a && c.mixIn(a);
            c.hasOwnProperty("init") || (c.init = function () {
                    c.$super.init.apply(this, arguments)
                }
            );
            c.init.prototype = c;
            c.$super = this;
            return c
        },
        create: function () {
            const a = this.extend();
            a.init.apply(a, arguments);
            return a
        },
        init: function () {
        },
        mixIn: function (a) {
            for (let c in a)
                a.hasOwnProperty(c) && (this[c] = a[c]);
            a.hasOwnProperty("toString") && (this.toString = a.toString)
        },
        clone: function () {
            return this.init.prototype.extend(this)
        }
    }
        , p = d.WordArray = k.extend({
        init: function (a, c) {
            a = this.words = a || [];
            this.sigBytes = c != l ? c : 4 * a.length
        },
        toString: function (a) {
            return (a || n).stringify(this)
        },
        concat: function (a) {
            const c = this.words
                , q = a.words
                , f = this.sigBytes;
            a = a.sigBytes;
            this.clamp();
            if (f % 4)
                for (var b = 0; b < a; b++)
                    c[f + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((f + b) % 4);
            else if (65535 < q.length)
                for (b = 0; b < a; b += 4)
                    c[f + b >>> 2] = q[b >>> 2];
            else
                c.push.apply(c, q);
            this.sigBytes += a;
            return this
        },
        clamp: function () {
            const a = this.words
                , c = this.sigBytes;
            a[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4);
            a.length = g.ceil(c / 4)
        },
        clone: function () {
            const a = k.clone.call(this);
            a.words = this.words.slice(0);
            return a
        },
        random: function (a) {
            for (var c = [], b = 0; b < a; b += 4)
                c.push(tk_Random.random(0, 4294967296) | 0);
            return new p.init(c, a)
        }
    })
        , b = e.enc = {}
        , n = b.Hex = {
        stringify: function (a) {
            const c = a.words;
            a = a.sigBytes;
            for (var b = [], f = 0; f < a; f++) {
                const d = c[f >>> 2] >>> 24 - 8 * (f % 4) & 255;
                b.push((d >>> 4).toString(16));
                b.push((d & 15).toString(16))
            }
            return b.join("")
        },
        parse: function (a) {
            for (var c = a.length, b = [], f = 0; f < c; f += 2)
                b[f >>> 3] |= parseInt(a.substr(f, 2), 16) << 24 - 4 * (f % 8);
            return new p.init(b, c / 2)
        }
    }
        , j = b.Latin1 = {
        stringify: function (a) {
            const c = a.words;
            a = a.sigBytes;
            for (var b = [], f = 0; f < a; f++)
                b.push(String.fromCharCode(c[f >>> 2] >>> 24 - 8 * (f % 4) & 255));
            return b.join("")
        },
        parse: function (a) {
            for (var c = a.length, b = [], f = 0; f < c; f++)
                b[f >>> 2] |= (a.charCodeAt(f) & 255) << 24 - 8 * (f % 4);
            return new p.init(b, c)
        }
    }
        , h = b.Utf8 = {
        stringify: function (a) {
            try {
                return decodeURIComponent(escape(j.stringify(a)))
            } catch (c) {
                throw Error("Malformed UTF-8 data");
            }
        },
        parse: function (a) {
            return j.parse(unescape(encodeURIComponent(a)))
        }
    }
        , r = d.BufferedBlockAlgorithm = k.extend({
        reset: function () {
            this._data = new p.init;
            this._nDataBytes = 0
        },
        _append: function (a) {
            "string" == typeof a && (a = h.parse(a));
            this._data.concat(a);
            this._nDataBytes += a.sigBytes
        },
        _process: function (a) {
            var c = this._data
                , b = c.words
                , f = c.sigBytes
                , d = this.blockSize
                , e = f / (4 * d)
                , e = a ? g.ceil(e) : g.max((e | 0) - this._minBufferSize, 0);
            a = e * d;
            f = g.min(4 * a, f);
            if (a) {
                for (var k = 0; k < a; k += d)
                    this._doProcessBlock(b, k);
                k = b.splice(0, a);
                c.sigBytes -= f
            }
            return new p.init(k, f)
        },
        clone: function () {
            const a = k.clone.call(this);
            a._data = this._data.clone();
            return a
        },
        _minBufferSize: 0
    });
    d.Hasher = r.extend({
        cfg: k.extend(),
        init: function (a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function () {
            r.reset.call(this);
            this._doReset()
        },
        update: function (a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function (a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function (a) {
            return function (b, d) {
                return (new a.init(d)).finalize(b)
            }
        },
        _createHmacHelper: function (a) {
            return function (b, d) {
                return (new s.HMAC.init(a, d)).finalize(b)
            }
        }
    });
    var s = e.algo = {};
    return e
}(Math);
(function () {
        var g = CryptoJS
            , l = g.lib
            , e = l.WordArray
            , d = l.Hasher
            , m = []
            , l = g.algo.SHA1 = d.extend({
            _doReset: function () {
                this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function (d, e) {
                for (var b = this._hash.words, n = b[0], j = b[1], h = b[2], g = b[3], l = b[4], a = 0; 80 > a; a++) {
                    if (16 > a)
                        m[a] = d[e + a] | 0;
                    else {
                        var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16];
                        m[a] = c << 1 | c >>> 31
                    }
                    c = (n << 5 | n >>> 27) + l + m[a];
                    c = 20 > a ? c + ((j & h | ~j & g) + 1518500249) : 40 > a ? c + ((j ^ h ^ g) + 1859775393) : 60 > a ? c + ((j & h | j & g | h & g) - 1894007588) : c + ((j ^ h ^ g) - 899497514);
                    l = g;
                    g = h;
                    h = j << 30 | j >>> 2;
                    j = n;
                    n = c
                }
                b[0] = b[0] + n | 0;
                b[1] = b[1] + j | 0;
                b[2] = b[2] + h | 0;
                b[3] = b[3] + g | 0;
                b[4] = b[4] + l | 0
            },
            _doFinalize: function () {
                const d = this._data
                    , e = d.words
                    , b = 8 * this._nDataBytes
                    , g = 8 * d.sigBytes;
                e[g >>> 5] |= 128 << 24 - g % 32;
                e[(g + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296);
                e[(g + 64 >>> 9 << 4) + 15] = b;
                d.sigBytes = 4 * e.length;
                this._process();
                return this._hash
            },
            clone: function () {
                const e = d.clone.call(this);
                e._hash = this._hash.clone();
                return e
            }
        });
        g.SHA1 = d._createHelper(l);
        g.HmacSHA1 = d._createHmacHelper(l)
    }
)();
(function () {
        const g = CryptoJS
            , l = g.enc.Utf8;
        g.algo.HMAC = g.lib.Base.extend({
            init: function (e, d) {
                e = this._hasher = new e.init;
                "string" == typeof d && (d = l.parse(d));
                const g = e.blockSize
                    , k = 4 * g;
                d.sigBytes > k && (d = e.finalize(d));
                d.clamp();
                for (var p = this._oKey = d.clone(), b = this._iKey = d.clone(), n = p.words, j = b.words, h = 0; h < g; h++)
                    n[h] ^= 1549556828,
                        j[h] ^= 909522486;
                p.sigBytes = b.sigBytes = k;
                this.reset()
            },
            reset: function () {
                const e = this._hasher;
                e.reset();
                e.update(this._iKey)
            },
            update: function (e) {
                this._hasher.update(e);
                return this
            },
            finalize: function (e) {
                const d = this._hasher;
                e = d.finalize(e);
                d.reset();
                return d.finalize(this._oKey.clone().concat(e))
            }
        })
    }
)();
const hexcase = 0;
const b64pad = "";
const chrsz = 8;

function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz))
}

function core_sha1(x, len) {
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    const w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;
    for (let i = 0; i < x.length; i += 16) {
        const olda = a;
        const oldb = b;
        const oldc = c;
        const oldd = d;
        const olde = e;
        for (let j = 0; j < 80; j++) {
            if (j < 16)
                w[j] = x[i + j];
            else
                w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            const t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde)
    }
    return Array(a, b, c, d, e)
}

function sha1_ft(t, b, c, d) {
    if (t < 20)
        return (b & c) | ((~b) & d);
    if (t < 40)
        return b ^ c ^ d;
    if (t < 60)
        return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d
}

function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
}

function core_hmac_sha1(key, data) {
    let bkey = str2binb(key);
    if (bkey.length > 16)
        bkey = core_sha1(bkey, key.length * chrsz);
    const ipad = Array(16)
        , opad = Array(16);
    for (let i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    const hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160)
}

function safe_add(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF)
}

function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
}

function str2binb(str) {
    const bin = Array();
    const mask = (1 << chrsz) - 1;
    for (let i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
    return bin
}

function binb2str(bin) {
    let str = "";
    const mask = (1 << chrsz) - 1;
    for (let i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
    return str
}

function binb2hex(binarray) {
    const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
    }
    return str
}

function binb2b64(binarray) {
    const tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let str = "";
    for (let i = 0; i < binarray.length * 4; i += 3) {
        const triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (let j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32)
                str += b64pad;
            else
                str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
        }
    }
    return str
}

function mgf1(mgfSeed, maskLen) {
    let t = "";
    const hLen = 20;
    const count = Math.ceil(maskLen / hLen);
    for (let i = 0; i < count; i++) {
        const c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
        t += pack(sha1Hash(mgfSeed + c));
    }

    return t.substring(0, maskLen);
}


function strtobin(a) {
    const ret = new Uint8Array(a.length);

    for (let i = 0; i < a.length; i++) {
        ret[i] = a.charCodeAt(i);
    }

    return ret;
}

function clear(input) {
    for (let i = 0; i < input.length; i++) {
        input[i] = 0;
    }
}


function rsaes_oaep_encrypt(m, n, k, e) {
    const hLen = 20;


    const mLen = m.length;
    if (mLen > k - 2 * hLen - 2) {
        throw Error("too long");
    }

    const lHash = "\xda\x39\xa3\xee\x5e\x6b\x4b\x0d\x32\x55\xbf\xef\x95\x60\x18\x90\xaf\xd8\x07\x09"; // pack(sha1Hash(""))

    let ps = "";
    let temp = k - mLen - 2 * hLen - 2;
    for (var i = 0; i < temp; i++) {
        ps += "\x00";
    }

    const db = lHash + ps + "\x01" + m;
    let seed = "";
    for (var i = 0; i < hLen + 4; i += 4) {
        temp = new Array(4);
        rng.nextBytes(temp);
        seed += String.fromCharCode(temp[0], temp[1], temp[2], temp[3]);
    }
    seed = seed.substring(4 - seed.length % 4);
    const dbMask = mgf1(seed, k - hLen - 1);
    const maskedDB = xor(db, dbMask);
    const seedMask = mgf1(maskedDB, hLen);
    const maskedSeed = xor(seed, seedMask);
    const em = "\x00" + maskedSeed + maskedDB;

    m = [];
    for (i = 0; i < em.length; i++) {
        m[i] = em.charCodeAt(i);
    }
    m = new BigInteger(m, 256);
    c = m.modPow(e, n);
    c = c.toString(16);
    if (c.length & 1) {
        c = "0" + c;
    }

    return c;
}

function pkcs7pad(plaintext) {
    const pad = 16 - (plaintext.length & 15);
    for (let i = 0; i < pad; i++) {
        plaintext += String.fromCharCode(pad);
    }
    return plaintext;
}

function aes_encrypt(plaintext, key, iv) {
    let ciphertext = [];
    plaintext = pkcs7pad(plaintext);
    key = new keyExpansion(key);
    for (let i = 0; i < plaintext.length; i += 16) {
        let block = new Array(16);
        for (var j = 0; j < 16; j++) {
            block[j] = plaintext.charCodeAt(i + j) ^ iv[j];
        }
        block = AESencrypt(block, key);
        for (var j = 0; j < 16; j++) {
            iv[j] = block[j];
        }
        ciphertext = ciphertext.concat(block);
    }
    return ciphertext;
}

function _asnhex_getByteLengthOfL_AtObj(s, pos) {
    if (s.substring(pos + 2, pos + 3) != '8')
        return 1;
    const i = parseInt(s.substring(pos + 3, pos + 4));
    if (i == 0)
        return -1;
    if (0 < i && i < 10)
        return i + 1;
    return -2
}

function _asnhex_getHexOfL_AtObj(s, pos) {
    const len = _asnhex_getByteLengthOfL_AtObj(s, pos);
    if (len < 1)
        return '';
    return s.substring(pos + 2, pos + 2 + len * 2)
}

function _asnhex_getIntOfL_AtObj(s, pos) {
    const hLength = _asnhex_getHexOfL_AtObj(s, pos);
    if (hLength == '')
        return -1;
    let bi;
    if (parseInt(hLength.substring(0, 1)) < 8) {
        bi = parseBigInt(hLength, 16)
    } else {
        bi = parseBigInt(hLength.substring(2), 16)
    }
    return bi.intValue()
}

function _asnhex_getStartPosOfV_AtObj(s, pos) {
    const l_len = _asnhex_getByteLengthOfL_AtObj(s, pos);
    if (l_len < 0)
        return l_len;
    return pos + (l_len + 1) * 2
}

function _asnhex_getHexOfV_AtObj(s, pos) {
    const pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
    const len = _asnhex_getIntOfL_AtObj(s, pos);
    return s.substring(pos1, pos1 + len * 2)
}

function _asnhex_getHexOfTLV_AtObj(s, pos) {
    const hT = s.substr(pos, 2);
    const hL = _asnhex_getHexOfL_AtObj(s, pos);
    const hV = _asnhex_getHexOfV_AtObj(s, pos);
    return hT + hL + hV
}

function _asnhex_getPosOfNextSibling_AtObj(s, pos) {
    const pos1 = _asnhex_getStartPosOfV_AtObj(s, pos);
    const len = _asnhex_getIntOfL_AtObj(s, pos);
    return pos1 + len * 2
}

function _asnhex_getPosArrayOfChildren_AtObj(h, pos) {
    const a = [];
    const p0 = _asnhex_getStartPosOfV_AtObj(h, pos);
    a.push(p0);
    const len = _asnhex_getIntOfL_AtObj(h, pos);
    let p = p0;
    let k = 0;
    while (1) {
        const pNext = _asnhex_getPosOfNextSibling_AtObj(h, p);
        if (pNext == null || (pNext - p0 >= (len * 2)))
            break;
        if (k >= 200)
            break;
        a.push(pNext);
        p = pNext;
        k++
    }
    len;
    p;
    k;
    return a
}

function _asnhex_getNthChildIndex_AtObj(h, idx, nth) {
    const a = _asnhex_getPosArrayOfChildren_AtObj(h, idx);
    return a[nth]
}

function _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList) {
    if (nthList.length == 0) {
        return currentIndex
    }
    const firstNth = nthList.shift();
    const a = _asnhex_getPosArrayOfChildren_AtObj(h, currentIndex);
    return _asnhex_getDecendantIndexByNthList(h, a[firstNth], nthList)
}

function _asnhex_getDecendantHexTLVByNthList(h, currentIndex, nthList) {
    const idx = _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList);
    return _asnhex_getHexOfTLV_AtObj(h, idx)
}

function _asnhex_getDecendantHexVByNthList(h, currentIndex, nthList) {
    const idx = _asnhex_getDecendantIndexByNthList(h, currentIndex, nthList);
    return _asnhex_getHexOfV_AtObj(h, idx)
}

function ASN1HEX() {
    return ASN1HEX
}

ASN1HEX.getByteLengthOfL_AtObj = _asnhex_getByteLengthOfL_AtObj;
ASN1HEX.getHexOfL_AtObj = _asnhex_getHexOfL_AtObj;
ASN1HEX.getIntOfL_AtObj = _asnhex_getIntOfL_AtObj;
ASN1HEX.getStartPosOfV_AtObj = _asnhex_getStartPosOfV_AtObj;
ASN1HEX.getHexOfV_AtObj = _asnhex_getHexOfV_AtObj;
ASN1HEX.getHexOfTLV_AtObj = _asnhex_getHexOfTLV_AtObj;
ASN1HEX.getPosOfNextSibling_AtObj = _asnhex_getPosOfNextSibling_AtObj;
ASN1HEX.getPosArrayOfChildren_AtObj = _asnhex_getPosArrayOfChildren_AtObj;
ASN1HEX.getNthChildIndex_AtObj = _asnhex_getNthChildIndex_AtObj;
ASN1HEX.getDecendantIndexByNthList = _asnhex_getDecendantIndexByNthList;
ASN1HEX.getDecendantHexVByNthList = _asnhex_getDecendantHexVByNthList;
ASN1HEX.getDecendantHexTLVByNthList = _asnhex_getDecendantHexTLVByNthList;

const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";

function tk_int2char(n) {
    return BI_RM.charAt(n)
}

function b64tohex(s) {
    let ret = "";
    let i;
    let k = 0;
    let slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad)
            break;
        v = b64map.indexOf(s.charAt(i));
        if (v < 0)
            continue;
        if (k == 0) {
            ret += tk_int2char(v >> 2);
            slop = v & 3;
            k = 1
        } else if (k == 1) {
            ret += tk_int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2
        } else if (k == 2) {
            ret += tk_int2char(slop);
            ret += tk_int2char(v >> 2);
            slop = v & 3;
            k = 3
        } else {
            ret += tk_int2char((slop << 2) | (v >> 4));
            ret += tk_int2char(v & 0xf);
            k = 0
        }
    }
    if (k == 1)
        ret += tk_int2char(slop << 2);
    return ret
}

function _x509_pemToBase64(sCertPEM) {
    let s = sCertPEM;
    s = s.replace("-----BEGIN CERTIFICATE-----", "");
    s = s.replace("-----END CERTIFICATE-----", "");
    s = s.replace(/[ \n]+/g, "");
    return s
}

function _x509_pemToHex(sCertPEM) {
    const b64Cert = _x509_pemToBase64(sCertPEM);
    const hCert = b64tohex(b64Cert);
    return hCert
}

function _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert) {
    const pTbsCert = ASN1HEX.getStartPosOfV_AtObj(hCert, 0);
    const a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, pTbsCert);
    if (a.length < 1)
        return -1;
    if (hCert.substring(a[0], a[0] + 10) == "a003020102") {
        if (a.length < 6)
            return -1;
        return a[6]
    } else {
        if (a.length < 5)
            return -1;
        return a[5]
    }
}

function _x509_getSubjectPublicKeyPosFromCertHex(hCert) {
    const pInfo = _x509_getSubjectPublicKeyInfoPosFromCertHex(hCert);
    if (pInfo == -1)
        return -1;
    const a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, pInfo);
    if (a.length != 2)
        return -1;
    const pBitString = a[1];
    if (hCert.substring(pBitString, pBitString + 2) != '03')
        return -1;
    const pBitStringV = ASN1HEX.getStartPosOfV_AtObj(hCert, pBitString);
    if (hCert.substring(pBitStringV, pBitStringV + 2) != '00')
        return -1;
    return pBitStringV + 2
}

function _x509_getPublicKeyHexArrayFromCertHex(hCert) {
    const p = _x509_getSubjectPublicKeyPosFromCertHex(hCert);
    const a = ASN1HEX.getPosArrayOfChildren_AtObj(hCert, p);
    if (a.length != 2)
        return [];
    const hN = ASN1HEX.getHexOfV_AtObj(hCert, a[0]);
    const hE = ASN1HEX.getHexOfV_AtObj(hCert, a[1]);
    if (hN != null && hE != null) {
        return [hN, hE]
    } else {
        return []
    }
}

function _x509_getPublicKeyHexArrayFromCertPEM(sCertPEM) {
    const hCert = _x509_pemToHex(sCertPEM);
    const a = _x509_getPublicKeyHexArrayFromCertHex(hCert);
    return a
}

_x509_DN_ATTRHEX = {
    "0603550406": "C",
    "060355040a": "O",
    "060355040b": "OU",
    "0603550403": "CN",
    "0603550405": "SN",
    "0603550408": "ST",
    "0603550407": "L"
};

function _x509_hex2dn(hDN) {
    let s = "";
    const a = ASN1HEX.getPosArrayOfChildren_AtObj(hDN, 0);
    for (let i = 0; i < a.length; i++) {
        const hRDN = ASN1HEX.getHexOfTLV_AtObj(hDN, a[i]);
        s = s + "/" + _x509_hex2rdn(hRDN)
    }
    return s
}

function _x509_hex2rdn(hRDN) {
    const hType = ASN1HEX.getDecendantHexTLVByNthList(hRDN, 0, [0, 0]);
    let hValue = ASN1HEX.getDecendantHexVByNthList(hRDN, 0, [0, 1]);
    let type;
    try {
        type = _x509_DN_ATTRHEX[hType]
    } catch (ex) {
        type = hType
    }
    hValue = hValue.replace(/(..)/g, "%$1");
    const value = decodeURIComponent(hValue);
    return type + "=" + value
}

function phpbb_encrypt2048(plaintext, k, e, n) {
    const temp = new Array(32);
    rng.nextBytes(temp);
    let key = "";
    for (let i = 16; i < 32; i++) // eg. temp.slice(16, 32)
    {
        key += String.fromCharCode(temp[i]);
    }

    const _e = new BigInteger(e, 16);
    const _n = new BigInteger(n, 16);

    let _rsaoen = "";

    while (_rsaoen.length < 512) {
        _rsaoen = rsaes_oaep_encrypt(plaintext, _n, k, _e);
        if (_rsaoen.length > 511)
            break;
    }

    return _rsaoen;
}

const genKey = new GenKey()
// noinspection JSUnusedLocalSymbols
const window = {crypto: {getRandomValues}}

module.exports = async (password) => {
    // const certPem = await fetch("https://hcs.eduro.go.kr/transkeyServlet", {
    //     method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
    //     body: "op=getPublicKey&TK_requestToken=0"
    // }).then(r => r.text())
    // const hexArray = _x509_getPublicKeyHexArrayFromCertPEM(certPem)
    // const pKey = {n: hexArray[0], k: 256, e: hexArray[1]}
    const pKey = {
        n: "00e58d6a1c010cf703505cb454520876b0e2a2e0c732652b18824d367c3a7b420ad56e148c84484ff48e1efcfc4534fe1e8773f57e07b5bb0f9880349978db85c2bbbc39ccf2ef899dd8ae56fa6401b4f3a1eace450cda1b0412752e4a7b163d85e35a3d87a8f50588f336bcfde8f10c616998f8475b54e139a5f62b875ebb46a4bd21c0bac7dacce227bfe6b08da53849118c61958dd17b5cedd96b898cfd0b6cabcceaa971c634456530c5cc0a7a99152e34abd2857387cc6cbddf6c393d035da9ac960232ae5f7dcc4f62d776235d46076a871e79d5527e40e74a8199f03bd1b342e415c3c647afb45820fa270e871379b183bde974ed13e1bd8b467f0d1729",
        k: 256,
        e: "010001"
    }
    const initTime = await fetch("https://hcs.eduro.go.kr/transkeyServlet?op=getInitTime").then(r => r.text())
    const decInitTime = initTime.split(";")[0].split("=")[1].replace(/'/g, "")
    const genSessionKey = genKey.GenerateKey(128)
    const sessionKey = Array(16);
    for (let i = 0; i < 16; i++) {
        sessionKey[i] = Number("0x0" + genSessionKey.charAt(i));
    }
    const encSessionKey = phpbb_encrypt2048(genSessionKey, pKey.k, pKey.e, pKey.n)
    let keyIndex = tk_Random.random(0, 67, 1, {}) + "";
    if ((keyIndex / 10) < 1) keyIndex = "0" + keyIndex;
    keyIndex = phpbb_encrypt2048(keyIndex, pKey.k, pKey.e, pKey.n);
    const dummy = await fetch("https://hcs.eduro.go.kr/transkeyServlet", {
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `op=getDummy&keyboardType=number&fieldType=password&keyIndex=${keyIndex}&talkBack=true`
    }).then(r => r.text())
    const keysXY = [
        [125, 27], [165, 27], [165, 67], [165, 107],
        [165, 147], [125, 147], [85, 147], [45, 147],
        [45, 107], [45, 67], [45, 27], [85, 27]
    ]
    const keys = dummy.split(",")
    let enc = password.split("").map(n => {
        const [x, y] = keysXY[keys.indexOf(n)]
        return delimiter + SeedEnc(`${x} ${y}`, sessionKey) + delimiter + SeedEnc(decInitTime, sessionKey)
    }).join("")
    const maxSize = 4 + genKey.tk_getrnd_int() % 10;
    for (let j = 4; j < maxSize; j++) {
        enc += delimiter + SeedEnc("d 0 0", sessionKey);
    }
    const hmac = HmacSHA256(enc, genSessionKey).toString()
    return JSON.stringify({
        raon: [{
            id: "password",
            enc,
            hmac,
            keyboardType: "number",
            keyIndex,
            fieldType: "password",
            seedKey: encSessionKey
        }]
    })
}
