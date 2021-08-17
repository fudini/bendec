impl std::convert::From<foo::Foo> for bar::Foo {
  fn from(value: foo::Foo) -> Self {
    match value {
      foo::Variant1 => Self::Variant1,
      foo::Variant2 => Self::Variant2,
      foo::Variant3 => Self::Variant3,
    }
  }
}
impl std::convert::From<bar::Foo> for foo::Foo {
  fn from(value: bar::Foo) -> Self {
    match value {
      bar::Variant1 => Self::Variant1,
      bar::Variant2 => Self::Variant2,
      bar::Variant3 => Self::Variant3,
    }
  }
}

