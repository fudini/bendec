function LargeMessageWrap(buf) {
  var buffer = buf
  return {
    header: {
      set msgType(v) { buffer.writeUInt8(v, 0) },
      get msgType() { return buffer.readUInt8(0) },
    },
    person1: {
      set a(v) { buffer.writeUInt16LE(v, 1) },
      get a() { return buffer.readUInt16LE(1) },
      set b(v) { buffer.writeUInt32LE(v, 3) },
      get b() { return buffer.readUInt32LE(3) },
      set c(v) { buffer.writeUInt32LE(v, 7) },
      get c() { return buffer.readUInt32LE(7) },
      set d(v) { buffer.writeUInt8(v, 11) },
      get d() { return buffer.readUInt8(11) },

    },
    person2: {
      set a(v) { buffer.writeUInt16LE(v, 12) },
      get a() { return buffer.readUInt16LE(12) },
      set b(v) { buffer.writeUInt32LE(v, 14) },
      get b() { return buffer.readUInt32LE(14) },
      set c(v) { buffer.writeUInt32LE(v, 18) },
      get c() { return buffer.readUInt32LE(18) },
      set d(v) { buffer.writeUInt8(v, 22) },
      get d() { return buffer.readUInt8(22) },
    },
    set aaa(v) { buffer.writeUInt32LE(v, 23) },
    get aaa() { return buffer.readUInt32LE(23) },
    set bbb(v) { buffer.writeUInt32LE(v, 27) },
    get bbb() { return buffer.readUInt32LE(27) },
    set ccc(v) { buffer.writeUInt32LE(v, 31) },
    get ccc() { return buffer.readUInt32LE(31) },
    set ddd(v) { buffer.writeUInt32LE(v, 35) },
    get ddd() { return buffer.readUInt32LE(35) },
    set eee(v) { buffer.writeUInt32LE(v, 39) },
    get eee() { return buffer.readUInt32LE(39) },
    set fff(v) { buffer.writeUInt8(v, 43) },
    get fff() { return buffer.readUInt8(43) },
    set ggg(v) { buffer.writeUInt8(v, 44) },
    get ggg() { return buffer.readUInt8(44) },
    set name1(v) { v.copy(buffer, 45) },
    get name1() { return buffer.slice(45, 109) },
    set name2(v) { v.copy(buffer, 109) },
    get name2() { return buffer.slice(109, 173) },
    set name3(v) { v.copy(buffer, 173) },
    get name3() { return buffer.slice(173, 237) },
    set name4(v) { v.copy(buffer, 237) },
    get name4() { return buffer.slice(237, 301) },
    setBuffer(b) { buffer = b; return this },
  }
}

function LargeMessageWrap2(buf) {
  var buffer = buf
  return {
    msgType(v) { buffer.writeUInt8(v, 0) },
    a(v) { buffer.writeUInt16LE(v, 1) },
    b(v) { buffer.writeUInt32LE(v, 3) },
    c(v) { buffer.writeUInt32LE(v, 7) },
    d(v) { buffer.writeUInt8(v, 11) },
    a2(v) { buffer.writeUInt16LE(v, 12) },
    b2(v) { buffer.writeUInt32LE(v, 14) },
    c2(v) { buffer.writeUInt32LE(v, 18) },
    d2(v) { buffer.writeUInt8(v, 22) },
    aaa(v) { buffer.writeUInt32LE(v, 23) },
    bbb(v) { buffer.writeUInt32LE(v, 27) },
    ccc(v) { buffer.writeUInt32LE(v, 31) },
    ddd(v) { buffer.writeUInt32LE(v, 35) },
    eee(v) { buffer.writeUInt32LE(v, 39) },
    fff(v) { buffer.writeUInt8(v, 43) },
    ggg(v) { buffer.writeUInt8(v, 44) },
    name1(v) { v.copy(buffer, 45) },
    name2(v) { v.copy(buffer, 109) },
    name3(v) { v.copy(buffer, 173) },
    name4(v) { v.copy(buffer, 237) },
    setBuffer(b) { buffer = b; return this },
  }
}

function LargeMessageWrap3(buf) {
  var buffer = buf
  function Wrap() {}
  Wrap.prototype = {
    msgType(v) { buffer.writeUInt8(v, 0) },
    a(v) { buffer.writeUInt16LE(v, 1) },
    b(v) { buffer.writeUInt32LE(v, 3) },
    c(v) { buffer.writeUInt32LE(v, 7) },
    d(v) { buffer.writeUInt8(v, 11) },
    a2(v) { buffer.writeUInt16LE(v, 12) },
    b2(v) { buffer.writeUInt32LE(v, 14) },
    c2(v) { buffer.writeUInt32LE(v, 18) },
    d2(v) { buffer.writeUInt8(v, 22) },
    aaa(v) { buffer.writeUInt32LE(v, 23) },
    bbb(v) { buffer.writeUInt32LE(v, 27) },
    ccc(v) { buffer.writeUInt32LE(v, 31) },
    ddd(v) { buffer.writeUInt32LE(v, 35) },
    eee(v) { buffer.writeUInt32LE(v, 39) },
    fff(v) { buffer.writeUInt8(v, 43) },
    ggg(v) { buffer.writeUInt8(v, 44) },
    name1(v) { v.copy(buffer, 45) },
    name2(v) { v.copy(buffer, 109) },
    name3(v) { v.copy(buffer, 173) },
    name4(v) { v.copy(buffer, 237) },
    setBuffer(b) { buffer = b; return this },
  }
  return new Wrap()
}

function LargeMessageWrap4(buf) {
  var buffer = buf
  return {
    set msgType(v) { buffer.writeUInt8(v, 0) },
    set a(v) { buffer.writeUInt16LE(v, 1) },
    set b(v) { buffer.writeUInt32LE(v, 3) },
    set c(v) { buffer.writeUInt32LE(v, 7) },
    set d(v) { buffer.writeUInt8(v, 11) },
    set a2(v) { buffer.writeUInt16LE(v, 12) },
    set b2(v) { buffer.writeUInt32LE(v, 14) },
    set c2(v) { buffer.writeUInt32LE(v, 18) },
    set d2(v) { buffer.writeUInt8(v, 22) },
    set aaa(v) { buffer.writeUInt32LE(v, 23) },
    set bbb(v) { buffer.writeUInt32LE(v, 27) },
    set ccc(v) { buffer.writeUInt32LE(v, 31) },
    set ddd(v) { buffer.writeUInt32LE(v, 35) },
    set eee(v) { buffer.writeUInt32LE(v, 39) },
    set fff(v) { buffer.writeUInt8(v, 43) },
    set ggg(v) { buffer.writeUInt8(v, 44) },
    set name1(v) { v.copy(buffer, 45) },
    set name2(v) { v.copy(buffer, 109) },
    set name3(v) { v.copy(buffer, 173) },
    set name4(v) { v.copy(buffer, 237) },
    setBuffer(b) { buffer = b; return this },
  }
}

export {
  LargeMessageWrap,
  LargeMessageWrap2,
  LargeMessageWrap3,
  LargeMessageWrap4
}
