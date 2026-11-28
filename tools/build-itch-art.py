# Voltline · tools/build-itch-art.py · Draws the itch.io cover, theme banner, page background and launch devlog header
# from the press-kit logo and screenshots. Run: python3 tools/build-itch-art.py (needs Pillow, fonttools, brotli).
import random, sys, tempfile
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R=ROOT+'/docs/press/'; O=R+'itch/'
BG=(18,7,38); MINT=(94,242,196); GOLD=(255,206,92)
from fontTools.ttLib import TTFont
f=TTFont(ROOT+'/fonts/chakra-petch-latin-700-normal.woff2'); f.flavor=None; f.save(tempfile.gettempdir()+'/chakra700.ttf')
f=TTFont(ROOT+'/fonts/chakra-petch-latin-500-normal.woff2'); f.flavor=None; f.save(tempfile.gettempdir()+'/chakra500.ttf')
def font(sz,w=700): return ImageFont.truetype(tempfile.gettempdir()+f'/chakra{w}.ttf',sz)
logo=Image.open(R+'logo.png').convert('RGBA')
def vgrad(w,h,top,bot,y0,y1):
    g=Image.new('L',(1,h))
    for y in range(h):
        t=0 if y<y0 else 1 if y>y1 else (y-y0)/(y1-y0); g.putpixel((0,y),int(top+(bot-top)*t))
    return g.resize((w,h))
def glow_text(im,xy,s,fnt,col,anchor='mm',blur=8):
    lay=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(lay); d.text(xy,s,font=fnt,fill=col+(255,),anchor=anchor)
    g=lay.filter(ImageFilter.GaussianBlur(blur)); im.alpha_composite(g); im.alpha_composite(lay)
# Cover 630x500 (and 2x)
for scale,name in ((1,'cover.png'),(2,'cover@2x.png')):
    W,H=630*scale,500*scale
    shot=Image.open(R+'screenshots/01-prism-grid.png').convert('RGBA').crop((175,44,175+629,44+500)).resize((W,H),Image.LANCZOS)
    dark=Image.new('RGBA',(W,H),BG+(255,)); m=vgrad(W,H,235,0,int(H*.30),int(H*.55)); shot=Image.composite(dark,shot,m)
    lg=logo.resize((int(W*.92),int(W*.92*360/1200)),Image.LANCZOS); shot.alpha_composite(lg,((W-lg.width)//2,int(H*.03)))
    shot.convert('RGB').save(O+name)
# Theme banner: logo on transparent, 960 wide
lg=logo.resize((960,288),Image.LANCZOS); lg.save(O+'banner.png')
# Page background 1920x1080: vector horizon grid + stars
W,H=1920,1080; rnd=random.Random(7)
bg=Image.new('RGBA',(W,H),BG+(255,)); d=ImageDraw.Draw(bg)
for y in range(H):
    t=y/H; c=tuple(int(BG[i]+( (31,14,57)[i]-BG[i])*t) for i in range(3)); d.line([(0,y),(W,y)],fill=c+(255,))
for _ in range(260):
    x,y=rnd.randrange(W),rnd.randrange(int(H*.58)); a=rnd.randrange(60,200); r=rnd.choice([1,1,1,2]); d.ellipse([x,y,x+r,y+r],fill=(230,220,255,a))
lay=Image.new('RGBA',(W,H),(0,0,0,0)); dl=ImageDraw.Draw(lay)
hz=int(H*.62)
for i in range(1,22):
    y=hz+int((H-hz)*(i/21)**1.8); dl.line([(0,y),(W,y)],fill=(170,90,255,int(30+60*i/21)),width=1)
for k in range(-30,31):
    dl.line([(W/2+k*14,hz),(W/2+k*150,H)],fill=(170,90,255,60),width=1)
pts=[(0,hz-40)]; x=0
while x<W: x+=rnd.randrange(60,160); pts.append((x,hz-rnd.randrange(10,170)))
dl.line(pts,fill=(120,70,220,150),width=2)
g=lay.filter(ImageFilter.GaussianBlur(3)); bg.alpha_composite(g); bg.alpha_composite(lay)
bg.convert('RGB').save(O+'background.png',optimize=True)
# Devlog header 960x400 from the Null Engine fight
W,H=960,400
shot=Image.open(R+'screenshots/05-null-engine.png').convert('RGBA').crop((0,72,960,472))
dark=Image.new('RGBA',(W,H),BG+(255,)); m=Image.linear_gradient('L').rotate(90).resize((W,H)); m=m.point(lambda v:int(v*.85))
shot=Image.composite(dark,shot,m)
lg=logo.resize((560,168),Image.LANCZOS); shot.alpha_composite(lg,(380,70))
glow_text(shot,(660,280),'NOW ON ITCH.IO  ·  FREE',font(34),GOLD,blur=6)
shot.convert('RGB').save(O+'devlog-launch.png')
